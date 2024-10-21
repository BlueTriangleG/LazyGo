import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    // lowercase email
    const { email: rawEmail, title, visit_count, id } = await request.json();
    const email = rawEmail.toLowerCase();

    if (!email || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }


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

    return new Response(JSON.stringify({ data: response }), { status: 201 });

  } catch (error) {
    console.error('Inser VisitedPlaces wrong:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase(); // 转为小写
  const title = searchParams.get('title'); // 获取 title 参数

  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);
    
    let response;

    // check if exist
    if (title) {
      response = await sql`
        SELECT * FROM VisitedPlaces WHERE email = ${email} AND title = ${title}
      `;
    } else {
      response = await sql`
        SELECT * FROM VisitedPlaces WHERE email = ${email}
      `;
    }

    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('Getting VisitedPlaces Wrong:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}



export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

    const { email, title, visit_count } = await request.json();


    if (!email || !title || typeof visit_count !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid required fields' }), 
        { status: 400 }
      );
    }

    const response = await sql`
      UPDATE VisitedPlaces
      SET visit_count = ${visit_count}
      WHERE email = ${email} AND title = ${title}
    `;


    if (response.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Record not found' }), { status: 404 });
    }


    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('更新 VisitedPlaces 数据时出错:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


// delete
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const title = searchParams.get('title');

  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);


    if (!email || !title) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    const response = await sql`
      DELETE FROM VisitedPlaces 
      WHERE email = ${email} AND title = ${title}
    `;

    if (response.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Record not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('Deleting VisitedPlaces Wrong:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}