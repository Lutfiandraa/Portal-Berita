const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ambil statistik jumlah user berdasarkan bulan
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS bulan,
        COUNT(*) AS jumlah_user
      FROM users
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY bulan ASC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Gagal ambil statistik user:', err);
    if (err.code === '42703') {
      return res.status(200).json([]);
    }
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;