import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    const {
      duration,
      destination,
      destinationDescrib,
      destinationDuration,
      transportation,
      distance,
      estimatedPrice,
      startLocation,
      endLocation,
      detailedInfo,
      email,
      photoReference,
      user_ratings_total = 0, // 新增字段，默认为 0
    } = await request.json();

    if (
      !duration ||
      !destination ||
      !destinationDescrib ||
      !destinationDuration ||
      !transportation ||
      !distance ||
      !estimatedPrice ||
      !startLocation ||
      !endLocation ||
      !email ||
      !photoReference
    ) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // 检查数据库是否已有相同的 destination，且不区分大小写
    const existingDestinationRecord = await sql`
      SELECT * FROM TravelHistory WHERE LOWER(destination) = LOWER(${destination})
    `;

    if (existingDestinationRecord.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Record with this destination already exists' }),
        { status: 409 } // 409 Conflict 状态码，表示请求冲突
      );
    }

    // 插入数据到 TravelHistory 表
    const response = await sql`
      INSERT INTO TravelHistory (
        duration,
        destination,
        destinationDescrib,
        destinationDuration,
        transportation,
        distance,
        estimatedPrice,
        startLocation,
        endLocation,
        detailedInfo,
        email,
        photoReference,
        user_ratings_total -- 新增字段
      ) VALUES (
        ${duration},
        ${destination},
        ${destinationDescrib},
        ${destinationDuration},
        ${transportation},
        ${distance},
        ${estimatedPrice},
        ${startLocation},
        ${endLocation},
        ${detailedInfo},
        ${email},
        ${photoReference},
        ${user_ratings_total} -- 新增字段
      )
      RETURNING *
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
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Missing email parameter' }),
        { status: 400 }
      );
    }

    // data from TravelHistory 
    const response = await sql`
      SELECT * FROM TravelHistory WHERE email = ${email}
    `;


    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('Error TravelHistory :', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
