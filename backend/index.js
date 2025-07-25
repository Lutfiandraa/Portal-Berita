require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');

const app = express();
const PORT = 4000;

// ✅ RUTE USER STATS
const userStatsRoute = require('./routes/userStats');

// ✅ Koneksi ke PostgreSQL
const pool = new Pool();
pool.connect()
  .then(() => console.log('✅ Terhubung ke PostgreSQL'))
  .catch(err => {
    console.error('❌ Gagal koneksi ke DB:', err);
    process.exit(1);
  });

// ✅ Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(express.json());
app.use(session({
  secret: 'captcha-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// ✅ GET SEMUA USER (untuk ManageUser.jsx)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT userid, email, name, status, last_active FROM users ORDER BY userid ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Gagal ambil data user:', error);
    res.status(500).json({ message: 'Gagal ambil data user' });
  }
});

// ✅ RUTE STATISTIK USER
app.use('/api/user-stats', userStatsRoute);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Halo dari backend Express.js!');
});

// ✅ CAPTCHA
app.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 3,
    color: true,
    background: '#eef',
  });

  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
});

app.post('/verify-captcha', (req, res) => {
  const { captcha } = req.body;
  if (captcha === req.session.captcha) {
    return res.json({ success: true });
  } else {
    return res.status(400).json({ error: 'Captcha salah' });
  }
});

// ✅ GET PROFILE
app.get('/profile', async (req, res) => {
  const { email, name } = req.query;

  try {
    if (email) {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
      return res.status(404).json({ error: 'User tidak ditemukan dengan email' });
    }

    if (name) {
      const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
      return res.status(404).json({ error: 'User tidak ditemukan dengan nama' });
    }

    return res.status(400).json({ error: 'Email atau nama harus disediakan' });
  } catch (err) {
    console.error('❌ Error saat mengambil data profil:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ✅ POST PROFILE (REGISTER)
app.post('/profile', async (req, res) => {
  const { email, password, name } = req.body;

  console.log('📥 Data diterima dari frontend:', req.body);

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, name, status, last_active, created_at)
       VALUES ($1, $2, $3, 'aktif', NOW(), CURRENT_TIMESTAMP)
       RETURNING *`,
      [email, password, name]
    );

    console.log('✅ Data berhasil disimpan ke DB:', result.rows[0]);

    res.status(201).json({ message: 'Profil berhasil disimpan', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email sudah digunakan' });
    }

    console.error('❌ Gagal simpan profil ke DB:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// ✅ POST CRITIC
app.post('/critics', async (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Nama dan komentar wajib diisi' });
  }

  try {
    const userResult = await pool.query('SELECT userid FROM users WHERE name = $1', [name]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const userid = userResult.rows[0].userid;

    const result = await pool.query(
      'INSERT INTO critics (userid, content, datecreated) VALUES ($1, $2, NOW()) RETURNING *',
      [userid, content]
    );

    res.status(201).json({ message: 'Kritik berhasil disimpan', data: result.rows[0] });
  } catch (err) {
    console.error('❌ Gagal simpan kritik:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ✅ LOGOUT
app.post('/logout', (req, res) => {
  console.log('👋 User logout:', new Date().toISOString());
  res.status(200).json({ message: 'Logout berhasil (handled di frontend)' });
});

// ✅ LISTEN SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});