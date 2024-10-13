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

export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 从请求中获取 JSON 数据
    const { email, title, visit_count } = await request.json();

    // 检查必填字段，确保 visit_count 是一个数字
    if (!email || !title || typeof visit_count !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid required fields' }), 
        { status: 400 }
      );
    }

    // 更新 VisitedPlaces 表中的 visit_count
    const response = await sql`
      UPDATE VisitedPlaces
      SET visit_count = ${visit_count}
      WHERE email = ${email} AND title = ${title}
    `;

    // 检查是否有行被更新
    if (response.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Record not found' }), { status: 404 });
    }

    // 返回成功响应
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('更新 VisitedPlaces 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


// 删除记录
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const title = searchParams.get('title');

  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 检查必填字段
    if (!email || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // 从 VisitedPlaces 表中删除数据
    const response = await sql`
      DELETE FROM VisitedPlaces 
      WHERE email = ${email} AND title = ${title}
    `;

    // 检查是否有行被删除
    if (response.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Record not found' }), { status: 404 });
    }

    // 返回成功响应
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('删除 VisitedPlaces 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}