// backend/routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // koneksi ke PostgreSQL

// ✅ Ambil semua user (basic info)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT userid, name, email, created_at, status FROM users ORDER BY userid ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Gagal mengambil data users:', err);
    res.status(500).json({ error: 'Gagal mengambil data users' });
  }
});

// ✅ Nonaktifkan user
router.put('/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE users SET status = $1 WHERE userid = $2',
      ['nonaktif', id]
    );
    res.status(200).json({ message: 'User dinonaktifkan' });
  } catch (err) {
    console.error('❌ Gagal nonaktifkan user:', err);
    res.status(500).json({ error: 'Gagal nonaktifkan user' });
  }
});

// ✅ Aktifkan user
router.put('/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE users SET status = $1 WHERE userid = $2',
      ['aktif', id]
    );
    res.status(200).json({ message: 'User diaktifkan' });
  } catch (err) {
    console.error('❌ Gagal aktifkan user:', err);
    res.status(500).json({ error: 'Gagal aktifkan user' });
  }
});

module.exports = router;