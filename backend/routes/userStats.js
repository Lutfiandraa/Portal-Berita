const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool();

// Ambil statistik jumlah user berdasarkan bulan
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS bulan,
        COUNT(*) AS jumlah_user
      FROM users
      GROUP BY bulan
      ORDER BY bulan ASC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Gagal ambil statistik user:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat ambil statistik user' });
  }
});

module.exports = router;