import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// ! CREATE ROW


export async function POST(req: NextRequest) {
  try {
    // ! relationship data
    const { person_id_1, person_id_2, relationship_type_id } = await req.json();
    console.log(person_id_1, person_id_2, relationship_type_id);

    // Validate input
    if (!person_id_1 || !person_id_2 || !relationship_type_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    // TODO: understand approach to keep data correct and unique
    const result = await sql`
      INSERT INTO relationships (person_id_1, person_id_2, relationship_type_id)
      VALUES (${person_id_1}, ${person_id_2}, ${relationship_type_id})
      RETURNING id, person_id_1, person_id_2, relationship_type_id
      `;

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating relationship:', error);
    return NextResponse.json({ error: 'Failed to create/update relationship' }, { status: 500 });
  }
}