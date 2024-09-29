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
