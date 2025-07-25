const express = require('express');
const router = express.Router();
const pool = require('../db'); // koneksi ke PostgreSQL

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error get users:', err);
    res.status(500).json({ error: 'Gagal mengambil data users' });
  }
});

module.exports = router;