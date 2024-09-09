import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`SELECT * FROM relationship_types`;
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}