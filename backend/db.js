// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'portalberita',
  password: process.env.PGPASSWORD || 'andra500',
  port: parseInt(process.env.PGPORT || '5432', 10),
});

module.exports = pool;