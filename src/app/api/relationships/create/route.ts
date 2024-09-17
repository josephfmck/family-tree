import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// ! CREATE ROW


export async function POST(req: Request) {
  try {
    // ! relationship data
    const { person1Id, person2Id, relationshipTypeId } = await req.json();
    console.log(person1Id, person2Id, relationshipTypeId);

    // Validate input
    if (!person1Id || !person2Id || !relationshipTypeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    // TODO: understand approach to keep data correct and unique
    const result = await sql`
      INSERT INTO relationships (person_id_1, person_id_2, relationship_type_id)
      VALUES (${person1Id}, ${person2Id}, ${relationshipTypeId})
      RETURNING id, person_id_1, person_id_2, relationship_type_id
      `;

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating relationship:', error);
    return NextResponse.json({ error: 'Failed to create/update relationship' }, { status: 500 });
  }
}