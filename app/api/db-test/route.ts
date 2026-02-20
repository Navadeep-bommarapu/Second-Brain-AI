import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT version()');
        client.release();
        return NextResponse.json({ success: true, version: result.rows[0].version });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ success: false, error: 'Database connection failed. Please check your credentials in .env.local' }, { status: 500 });
    }
}
