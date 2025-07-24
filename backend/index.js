require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: 'captcha-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Koneksi ke PostgreSQL
const pool = new Pool();

pool.connect()
  .then(() => console.log('✅ Terhubung ke PostgreSQL'))
  .catch(err => {
    console.error('❌ Gagal koneksi ke DB:', err);
    process.exit(1);
  });

//Tes koneksi
app.get('/', (req, res) => {
  res.send('Halo dari backend Express.js!');
});

//CAPTCHA generator
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

//Verifikasi CAPTCHA dari frontend
app.post('/verify-captcha', (req, res) => {
  const { captcha } = req.body;
  if (captcha === req.session.captcha) {
    return res.json({ success: true });
  } else {
    return res.status(400).json({ error: 'Captcha salah' });
  }
});

//Ambil profil berdasarkan email ATAU name
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

//Simpan profil baru
app.post('/profile', async (req, res) => {
  const { email, password, name } = req.body;

  console.log('📥 Data diterima dari frontend:', req.body);

  if (!email || !password || !name) {
    console.warn('⚠️ Ada field kosong');
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );

    console.log('✅ Data berhasil disimpan ke DB:', result.rows[0]);

    res.status(201).json({ message: 'Profil berhasil disimpan', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email sudah digunakan' });
    }

    console.error('❌ Gagal menyimpan profil ke DB:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

//Simpan kritik berdasarkan nama user dan isi content
app.post('/critics', async (req, res) => {
  const { name, content } = req.body;

  console.log('🗣️ Kritik masuk dari user:', name, '| Isi:', content);

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

    console.log('✅ Kritik berhasil disimpan:', result.rows[0]);

    res.status(201).json({ message: 'Kritik berhasil disimpan', data: result.rows[0] });
  } catch (err) {
    console.error('❌ Gagal simpan kritik:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

//Logout sederhana
app.post('/logout', (req, res) => {
  console.log('👋 User logout:', new Date().toISOString());
  res.status(200).json({ message: 'Logout berhasil (handled di frontend)' });
});

//Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});