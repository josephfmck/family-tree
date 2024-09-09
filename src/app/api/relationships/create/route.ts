import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// ! CREATE ROW
// export async function POST(req: Request) {
//   try {
//     const relationship = await req.json();
//     const { person1Id, person2Id, relationshipTypeId } = relationship;

//     // Validate input
//     if (!person1Id || !person2Id || !relationshipTypeId) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const result = await sql`
//       INSERT INTO relationships (person_id_1, person_id_2, relationship_type_id)
//       VALUES (${person1Id}, ${person2Id}, ${relationshipTypeId})
//       RETURNING id;
//     `;

//     return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating relationship:', error);
//     return NextResponse.json({ error: 'Failed to create relationship' }, { status: 500 });
//   }
// }


export async function POST(req: Request) {
  try {
    // ! relationship data
    const { person1Id, person2Id, relationshipTypeId } = await req.json();

    // Validate input
    if (!person1Id || !person2Id || !relationshipTypeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO relationships (person_id_1, person_id_2, relationship_type_id)
      VALUES (${person1Id}, ${person2Id}, ${relationshipTypeId})
      ON CONFLICT (person_id_1, person_id_2, relationship_type_id)
      DO UPDATE SET
        person_id_1 = EXCLUDED.person_id_1,
        person_id_2 = EXCLUDED.person_id_2,
        relationship_type_id = EXCLUDED.relationship_type_id
      RETURNING id;
    `;

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating relationship:', error);
    return NextResponse.json({ error: 'Failed to create/update relationship' }, { status: 500 });
  }
}