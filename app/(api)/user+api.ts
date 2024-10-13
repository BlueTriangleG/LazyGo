import { neon } from '@neondatabase/serverless'
export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`)
    const { name, email, clerkId } = await request.json()
    if (!email || !name || !clerkId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    const response = await sql`
            INSERT INTO users (name, email, clerk_id )
            VALUES (${name}, ${email}, ${clerkId})
            `
    return new Response(JSON.stringify({ data: response }), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    let email = url.searchParams.get('email')
    // change email to lower case
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email query parameter is required' }),
        { status: 400 }
      )
    }
    email = email.toLowerCase()
    const sql = neon(`${process.env.EXPO_PUBLIC_DATABASE_URL}`)
    const response = await sql`
      SELECT name, email FROM users WHERE email = ${email}
    `

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify({ data: response[0] }), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
