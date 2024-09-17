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


//    Maintains the directionality of the relationship (person1 is the subject, person2 is the object).
// 2. Prevents self-relationships with the WHERE ${person1Id} != ${person2Id} clause.
// 3. Updates the relationship_type_id if a relationship between these two people already exists, but doesn't swap the order of the people.
// Returns the full relationship data, which can be useful for updating the client-side state.
// On the client side, in your RelationshipForm.tsx, you should update the addRelationship dispatch to include all the returned data:
    
    const result = await sql`
      INSERT INTO relationships (person_id_1, person_id_2, relationship_type_id)
      VALUES (${person1Id}, ${person2Id}, ${relationshipTypeId})
      WHERE ${person1Id} != ${person2Id}
      ON CONFLICT (person_id_1, person_id_2, relationship_type_id)
      DO UPDATE SET
        relationship_type_id = EXCLUDED.relationship_type_id
      RETURNING id, person_id_1, person_id_2, relationship_type_id;
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Cannot create self-relationship' }, { status: 400 });
    }

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating relationship:', error);
    return NextResponse.json({ error: 'Failed to create/update relationship' }, { status: 500 });
  }
}