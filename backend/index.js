require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const bcrypt = require('bcrypt');

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
  origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: 'captcha-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// ✅ GET SEMUA USER
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

// ✅ PATCH: Aktivasi User
app.patch('/api/users/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'aktif' WHERE userid = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User activated successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to activate user', error });
  }
});

// ✅ PATCH: Nonaktifkan User
app.patch('/api/users/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'nonaktif' WHERE userid = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.status(200).json({ message: 'User berhasil dinonaktifkan', user: result.rows[0] });
  } catch (error) {
    console.error('❌ Gagal menonaktifkan user:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ✅ GET SEMUA CRITICS
app.get('/api/critics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.criticid AS id,
        u.email, 
        c.content AS message, 
        TO_CHAR(c.datecreated, 'Month DD, YYYY') AS last_active
      FROM critics c
      JOIN users u ON c.userid = u.userid
      ORDER BY c.criticid ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Gagal ambil data critics:', err);
    res.status(500).json({ error: 'Gagal ambil data kritik' });
  }
});

// ✅ DELETE CRITIC BY ID
app.delete('/api/critics/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM critics WHERE criticid = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Critic tidak ditemukan' });
    }
    res.status(200).json({ message: 'Critic berhasil dihapus' });
  } catch (err) {
    console.error('❌ Gagal hapus kritik:', err);
    res.status(500).json({ error: 'Gagal menghapus kritik' });
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

// ✅ LOGIN ADMIN
app.post('/login-admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Admin tidak ditemukan' });
    }
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: 'Password salah' });
    }
    res.json({ message: 'Login berhasil', admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    console.error('Gagal login admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGOUT
app.post('/logout', (req, res) => {
  console.log('👋 User logout:', new Date().toISOString());
  res.status(200).json({ message: 'Logout berhasil (handled di frontend)' });
});

// ✅ CEK STATUS USER AKTIF/NONAKTIF
app.get('/auth/status', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email wajib diisi' });
  try {
    const result = await pool.query('SELECT status FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    return res.json({ status: result.rows[0].status }); // 'aktif' atau 'nonaktif'
  } catch (err) {
    console.error('❌ Gagal cek status user:', err);
    res.status(500).json({ error: 'Kesalahan server' });
  }
});

// ✅ LISTEN SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});