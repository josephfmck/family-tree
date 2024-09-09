import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Person ID is required' }, { status: 400 });
    }

    await sql`DELETE FROM persons WHERE id = ${id}`;

    return NextResponse.json({ message: 'Person deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}