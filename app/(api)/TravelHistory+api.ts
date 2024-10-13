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
