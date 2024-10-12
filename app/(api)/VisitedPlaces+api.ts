import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 从请求中获取 JSON 数据
    const { email, title, visit_count } = await request.json();

    // 检查必填字段
    if (!email || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // 插入数据到 VisitedPlaces 表
    const response = await sql`
      INSERT INTO VisitedPlaces (email, title, visit_count)
      VALUES (${email}, ${title}, ${visit_count || 1})
    `;

    // 返回成功响应
    return new Response(JSON.stringify({ data: response }), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);
    
    // 从 VisitedPlaces 表中查询数据
    const response = await sql`
      SELECT * FROM VisitedPlaces WHERE email = ${email}
    `;

    // 返回查询结果
    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('获取 VisitedPlaces 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
