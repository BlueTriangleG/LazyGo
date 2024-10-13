import { neon } from '@neondatabase/serverless';

// POST 方法：用于插入新的旅行历史记录
export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // 从请求中获取 JSON 数据
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
    } = await request.json();

    // 检查必填字段
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
      !email
    ) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
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
        email
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
        ${email}
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

// GET 方法：用于获取指定用户的旅行历史记录
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);
    
    // 检查 email 是否提供
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Missing email parameter' }),
        { status: 400 }
      );
    }

    // 从 TravelHistory 表中查询数据
    const response = await sql`
      SELECT * FROM TravelHistory WHERE email = ${email}
    `;

    // 返回查询结果
    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('获取 TravelHistory 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
