import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log(' MySQL connection successful');
    connection.release();
  })
  .catch(error => {
    console.error(' MySQL connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
  });

export const db = drizzle(pool, { schema, mode: 'default' });