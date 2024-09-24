import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the pool



//* Grabbing the IDs of relationships 
export async function GET() {
    try {
        const result = await pool.query(`SELECT * FROM relationships`);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching relationships:', error);
        return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
    }
}