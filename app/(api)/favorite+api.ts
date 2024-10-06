import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 从请求中获取 JSON 数据
    const { transportation, distance, estimatedPrice, description, tips, email } = await request.json();

    // 检查必填字段
    if (!transportation || !distance || !estimatedPrice || !description || !tips || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // 插入数据到 favorite 表
    const response = await sql`
      INSERT INTO favorite (transportation, distance, estimated_price, description, tips, email)
      VALUES (${transportation}, ${distance}, ${estimatedPrice}, ${description}, ${tips}, ${email})
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
    
    // 从 favorite 表中查询数据
    const response = await sql`
      SELECT * FROM favorite WHERE email = ${email}
    `;

    // 返回查询结果
    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('获取 favorite 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
