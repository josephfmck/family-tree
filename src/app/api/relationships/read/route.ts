import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


//* Grabbing the IDs of relationships 
export async function GET() {
    try {
        const result = await sql`
        SELECT * FROM relationships
        `;
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching relationships:', error);
        return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
    }
}