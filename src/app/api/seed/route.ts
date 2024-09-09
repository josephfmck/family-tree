import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    // Insert persons
    const persons = [
      ['John', 'Doe'],
      ['Jane', 'Smith'],
      ['Michael', 'Johnson'],
      ['Emily', 'Davis'],
      ['Chris', 'Brown'],
      ['Sarah', 'Miller'],
      ['David', 'Wilson'],
      ['Emma', 'Taylor'],
      ['James', 'Anderson'],
      ['Olivia', 'Thomas']
    ];

    for (const [firstName, lastName] of persons) {
      await sql`
        INSERT INTO persons (first_name, last_name)
        VALUES (${firstName}, ${lastName})
        ON CONFLICT (first_name, last_name) DO NOTHING;
      `;
    }

    // Insert relationship types
    const relationshipTypes = [
      'Parent', 'Child', 'Sibling', 'Grandparent', 'Grandchild',
      'Aunt/Uncle', 'Niece/Nephew', 'Cousin', 'Great-Grandparent', 'Great-Grandchild'
    ];

    for (const relationship of relationshipTypes) {
      await sql`
        INSERT INTO relationship_types (relationship)
        VALUES (${relationship})
        ON CONFLICT (relationship) DO NOTHING;
      `;
    }

    // Insert relationships
    const relationships = [
      ['John', 'Doe', 'Jane', 'Smith', 'Parent'],
      ['Jane', 'Smith', 'John', 'Doe', 'Child'],
      ['Michael', 'Johnson', 'Emily', 'Davis', 'Sibling'],
      ['Chris', 'Brown', 'Sarah', 'Miller', 'Grandparent'],
      ['David', 'Wilson', 'Emma', 'Taylor', 'Grandchild'],
      ['Michael', 'Johnson', 'Chris', 'Brown', 'Aunt/Uncle'],
      ['Emily', 'Davis', 'Sarah', 'Miller', 'Niece/Nephew'],
      ['James', 'Anderson', 'Olivia', 'Thomas', 'Cousin'],
      ['Jane', 'Smith', 'David', 'Wilson', 'Great-Grandparent'],
      ['Emma', 'Taylor', 'Olivia', 'Thomas', 'Great-Grandchild']
    ];

    for (const [firstName1, lastName1, firstName2, lastName2, relationship] of relationships) {
        const { rows: [person1] } = await sql`SELECT id FROM persons WHERE first_name = ${firstName1} AND last_name = ${lastName1}`;
        const { rows: [person2] } = await sql`SELECT id FROM persons WHERE first_name = ${firstName2} AND last_name = ${lastName2}`;
        const { rows: [relationType] } = await sql`SELECT id FROM relationship_types WHERE relationship = ${relationship}`;
        
      if (person1 && person2 && relationType) {
        await sql`
          INSERT INTO relationships (person_id_1, person_id_2, relationship_type_id)
          VALUES (${person1.id}, ${person2.id}, ${relationType.id})
          ON CONFLICT (person_id_1, person_id_2, relationship_type_id) DO NOTHING;
        `;
      }
    }

    return NextResponse.json({ message: "Database seeded successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}