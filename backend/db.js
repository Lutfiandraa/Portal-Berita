// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      // ganti sesuai config PostgreSQL kamu
  host: 'localhost',
  database: 'portalberita', // nama database kamu
  password: 'postgres',  // password PostgreSQL
  port: 5432,
});

module.exports = pool;