import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(
    // req,res
  request: Request,
  { params }: { params: { id: string } }
) {
  // grab id we sent
  const id = params.id;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Person ID is required' }, { status: 400 });
    }

    // grab request
    const { first_name, last_name } = await request.json();

    if (!first_name || !last_name) {
        return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    await sql`UPDATE persons SET first_name = ${first_name}, last_name = ${last_name} 
    WHERE id = ${id}`;

    return NextResponse.json({ message: 'Person updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}