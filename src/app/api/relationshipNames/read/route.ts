import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the pool


export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                r.id,
                p1.first_name AS person1_first_name,
                p1.last_name AS person1_last_name,
                p2.first_name AS person2_first_name,
                p2.last_name AS person2_last_name,
                rt.relationship AS relationship_type
            FROM 
                relationships r
            JOIN 
                persons p1 ON r.person_id_1 = p1.id
            JOIN 
                persons p2 ON r.person_id_2 = p2.id
            JOIN 
                relationship_types rt ON r.relationship_type_id = rt.id
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching relationships:', error);
        return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
    }
}