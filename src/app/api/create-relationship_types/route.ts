import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from "next";

 
export async function GET(req: any, res: any) {



  try {
    // drop table if it exists
    await sql`DROP TABLE IF EXISTS relationship_types;`;
    // create table
    const result =
      await sql`CREATE TABLE relationship_types (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	    relationship VARCHAR(255) NOT NULL UNIQUE,
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
    
    // return response of table
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}