import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the pool


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ error: 'Person ID is required' }, { status: 400 });
    }
    // Use a parameterized query to avoid SQL injection
    const result = await pool.query('DELETE FROM persons WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }


    return NextResponse.json({ message: 'Person deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}