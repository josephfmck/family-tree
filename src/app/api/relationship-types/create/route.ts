import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// mother father etc.
export async function POST(req: NextRequest) {
  try {
    const { relationship } = await req.json();
    const result = await sql`
      INSERT INTO relationship_types (relationship)
      VALUES 
      (${relationship})
      RETURNING id
    `;

  // if INSERT statement does not include a RETURNING clause, result.rows will be empty.
  // and result in undefined, which can cause an error.
    
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}