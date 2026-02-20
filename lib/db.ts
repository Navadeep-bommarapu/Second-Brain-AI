import { Pool } from 'pg';

// Create a new connection pool using the connection string from environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
