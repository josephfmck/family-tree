import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the pool


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Relationship_Type ID is required' }, { status: 400 });
    }
    // Use a parameterized query to avoid SQL injection
    const result = await pool.query('DELETE FROM relationship_types WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Relationship_Type not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Relationship_Type deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting relationship_type:', error);
    return NextResponse.json({ error: 'Failed to delete relationship_type' }, { status: 500 });
  }
}