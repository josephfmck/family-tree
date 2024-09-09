import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// mother father etc.
export async function POST(req: Request) {
  try {
    const { relationship } = await req.json();
    const result = await sql`
      INSERT INTO relationship_types (relationship)
      VALUES 
      (${relationship})
    `;

    
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}