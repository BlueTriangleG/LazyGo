import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 从请求中获取 JSON 数据
    const { email, title, visit_count, id } = await request.json();

    // 检查必填字段
    if (!email || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // 如果提供了 id，则使用 id 插入，否则只插入 email、title 和 visit_count
    let response;
    if (id) {
      response = await sql`
        INSERT INTO VisitedPlaces (id, email, title, visit_count)
        VALUES (${id}, ${email}, ${title}, ${visit_count || 1})
      `;
    } else {
      response = await sql`
        INSERT INTO VisitedPlaces (email, title, visit_count)
        VALUES (${email}, ${title}, ${visit_count || 1})
      `;
    }

    // 返回成功响应
    return new Response(JSON.stringify({ data: response }), { status: 201 });

  } catch (error) {
    console.error('插入 VisitedPlaces 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const title = searchParams.get('title'); // 获取 title 参数

  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);
    
    let response;

    // 根据参数决定查询的条件
    if (title) {
      // 如果有 title，使用 email 和 title 查询
      response = await sql`
        SELECT * FROM VisitedPlaces WHERE email = ${email} AND title = ${title}
      `;
    } else {
      // 如果没有 title，仅通过 email 查询
      response = await sql`
        SELECT * FROM VisitedPlaces WHERE email = ${email}
      `;
    }

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