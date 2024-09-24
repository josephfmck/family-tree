import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


// CREATE ROW
export async function POST(req: Request) {
  try {
    const { first_name, last_name } = await req.json();
    const result = await sql`
      INSERT INTO persons (first_name, last_name)
      VALUES (${first_name}, ${last_name})
      RETURNING id;
    `;
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}