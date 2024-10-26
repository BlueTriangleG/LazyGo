import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 从请求中获取 JSON 数据
    const { 
      title, 
      description, 
      tempLat, 
      tempLong, 
      email, 
      duration, 
      destinationDuration, 
      transportation, 
      distance, 
      estimatedPrice, 
      photoReference, 
      tips,
      user_ratings_total = 0 
    } = await request.json();

    // 检查必填字段
    if (!title || !description || tempLat === undefined || tempLong === undefined || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // 查询数据库是否已有相同的 title，且不区分大小写
    const existingTitleRecord = await sql`
      SELECT * FROM favorite WHERE LOWER(title) = LOWER(${title})
    `;

    if (existingTitleRecord.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Record with this title already exists' }), 
        { status: 409 } // 409 Conflict 状态码，表示请求冲突
      );
    }

    // 查询数据库是否已有相同的 photoReference
    const existingPhotoReferenceRecord = await sql`
      SELECT * FROM favorite WHERE photoReference = ${photoReference}
    `;

    if (existingPhotoReferenceRecord.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Record with this photoReference already exists' }), 
        { status: 409 } // 409 Conflict 状态码，表示请求冲突
      );
    }

    // 如果数据库中没有相同的 title 和 photoReference，插入数据
    const response = await sql`
      INSERT INTO favorite (
        title, 
        description, 
        tempLat, 
        tempLong, 
        email, 
        duration, 
        destinationDuration, 
        transportation, 
        distance, 
        estimatedPrice, 
        photoReference, 
        tips,
        user_ratings_total -- 新增字段
      ) VALUES (
        ${title}, 
        ${description}, 
        ${tempLat}, 
        ${tempLong}, 
        ${email}, 
        ${duration}, 
        ${destinationDuration}, 
        ${transportation}, 
        ${distance}, 
        ${estimatedPrice}, 
        ${photoReference}, 
        ${tips},
        ${user_ratings_total} -- 新增字段
      )
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
