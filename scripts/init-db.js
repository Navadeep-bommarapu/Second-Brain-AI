const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function initDB() {
    const client = await pool.connect();
    try {
        console.log('Connected to database, ensuring knowledge table exists...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        tags TEXT,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Knowledge table is ready.');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

initDB();
