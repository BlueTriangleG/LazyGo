import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`);

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

    // check needed
    if (!title || !description || tempLat === undefined || tempLong === undefined || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400 }
      );
    }

    // check if title already in database with the same email
    const existingTitleRecord = await sql`
      SELECT * FROM favorite 
      WHERE LOWER(title) = LOWER(${title}) 
      AND email = ${email}
    `;

    if (existingTitleRecord.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Record with this title already exists for this email' }), 
        { status: 409 }
      );
    }

    // check if photoReference already in database with the same email
    const existingPhotoReferenceRecord = await sql`
      SELECT * FROM favorite 
      WHERE photoReference = ${photoReference} 
      AND email = ${email}
    `;

    if (existingPhotoReferenceRecord.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Record with this photoReference already exists for this email' }), 
        { status: 409 }
      );
    }

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
        user_ratings_total 
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
        ${user_ratings_total} 
      )
    `;

    // return success
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
    
    // get data from favorite 
    const response = await sql`
      SELECT * FROM favorite WHERE email = ${email}
    `;


    return new Response(JSON.stringify(response), { status: 200 });

  } catch (error) {
    console.error('Getting favorite wrong:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
