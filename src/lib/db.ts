// src/lib/db.ts
import { Pool } from 'pg';

// reuses connections instead of creating a new one for each query
// Without a pool, each query would:

// Open a new connection to the database.
// Send the query.
// Close the connection.

// With a connection pool:
// Connections are created once and then reused for future queries. This is especially helpful for applications that handle many requests, as opening a new connection for each query would be inefficient.

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure POSTGRES_URL is set in your .env file
});

export { pool };



// . Stale Connection Handling:
// When you were not using a pool and querying the database directly (e.g., using @vercel/postgres), there might have been stale or unclosed database connections.
// Some database clients or environments (like Vercel's serverless functions) could cache or reuse database connections inefficiently, especially in serverless environments where database connections might not be cleaned up properly between function invocations.
// Without pooling, these stale connections might return old or cached results, even if the data in the database has been updated. This could explain why your API was returning outdated data even after the rows were deleted.
// How Pooling Fixes This:
// The pg Pool manages connections more efficiently by ensuring that:
// Each connection is properly reused or reset after a query.
// Any stale or broken connections are cleaned up or replaced.
// This makes sure that every query is executed using a fresh connection, thus reflecting the latest data from the database.