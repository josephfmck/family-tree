import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


// CREATE ROW
export async function POST(req: Request) {
  try {
    const { firstName, lastName } = await req.json();
    const result = await sql`
      INSERT INTO persons (first_name, last_name)
      VALUES (${firstName}, ${lastName})
      RETURNING id;
    `;
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}