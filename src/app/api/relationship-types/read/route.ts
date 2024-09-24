import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the pool

export async function GET() {
  try {
    const result = await pool.query(`SELECT * FROM relationship_types`);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}