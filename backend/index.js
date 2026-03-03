require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ RUTE USER STATS
const userStatsRoute = require('./routes/userStats');

// ✅ Koneksi ke PostgreSQL - Gunakan pool dari db.js
const pool = require('./db');

// Test koneksi database
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Terhubung ke PostgreSQL'))
  .catch(err => {
    console.error('❌ Gagal koneksi ke DB:', err);
    process.exit(1);
  });

// ✅ MIDDLEWARE SETUP - HARUS DULUAN SEBELUM SESSION
app.use(express.json());

// ✅ CORS Configuration yang Lebih Lengkap
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
}));

// ✅ Handle Preflight Requests (Express 5: wildcard harus bernama, bukan '*')
app.options('{*splat}', cors());

// ✅ Session Store (Gunakan MemoryStore untuk development)
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'captcha-secret-key-development-ubah-ini',
  resave: false,
  saveUninitialized: false, // Changed to false for security
  cookie: {
    secure: false, // Set true jika HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 jam
    sameSite: 'lax'
  },
  name: 'feedback.sid' // Custom session name
};

// ✅ Jika di production, gunakan secure cookies
if (app.get('env') === 'production') {
  sessionConfig.cookie.secure = true;
  sessionConfig.proxy = true;
}

app.use(session(sessionConfig));

// ✅ Middleware untuk debug session (hanya di development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('🔍 Session Debug:', {
      sessionId: req.sessionID,
      session: req.session,
      cookies: req.headers.cookie
    });
    next();
  });
}

// ✅ TEST ENDPOINT - Cek session bekerja (hanya di development)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/test-session', (req, res) => {
    console.log('🧪 Test Session - Current Session:', req.session);
    res.json({ 
      sessionId: req.sessionID,
      session: req.session,
      message: 'Test session endpoint' 
    });
  });
}

// ✅ CEK SESSION - Improved
app.get('/api/check-session', (req, res) => {
  console.log('🔍 Check Session - Full Session:', req.session);
  
  if (req.session.userEmail && req.session.isLoggedIn) {
    res.json({ 
      isLoggedIn: true, 
      userEmail: req.session.userEmail,
      userName: req.session.userName,
      userId: req.session.userId,
      sessionId: req.sessionID
    });
  } else {
    res.json({ 
      isLoggedIn: false,
      sessionId: req.sessionID,
      message: 'No active session found'
    });
  }
});

// ✅ LOGIN USER - Improved dengan lebih banyak logging
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Attempting login for:', email);
  console.log('📥 Request body:', req.body);
  
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'User not found' });
    }

    const userData = user.rows[0];
    console.log('👤 User found:', { email: userData.email, status: userData.status });
    
    let valid;
    
    // Cek apakah password sudah di-hash
    if (userData.password.startsWith('$2b$')) {
      // Password sudah di-hash
      valid = await bcrypt.compare(password, userData.password);
    } else {
      // Password plain text (untuk development saja)
      valid = password === userData.password;
      console.log('🔓 Using plain text password comparison');
    }

    if (!valid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Cek status user
    if (userData.status !== 'aktif') {
      console.log('❌ User not active:', email);
      return res.status(401).json({ message: 'Your account is not active. Please contact the administrator.' });
    }

    // Menyimpan user data di session setelah login berhasil
    req.session.userId = userData.userid;
    req.session.userEmail = userData.email;
    req.session.userName = userData.name;
    req.session.isLoggedIn = true;

    // Save session explicitly
    req.session.save((err) => {
      if (err) {
        console.error('❌ Error saving session:', err);
        return res.status(500).json({ message: 'Server error whilst signing in' });
      }

      console.log('✅ Login successful - Session created:', {
        userId: req.session.userId,
        userEmail: req.session.userEmail,
        sessionId: req.sessionID
      });

      res.status(200).json({ 
        message: 'Sign-in successful',
        user: {
          email: userData.email,
          name: userData.name,
          userId: userData.userid
        },
        sessionId: req.sessionID
      });
    });
    
  } catch (error) {
    console.error('❌ Error login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGOUT - Improved
app.post('/logout', (req, res) => {
  const userEmail = req.session.userEmail;
  console.log('👋 User logout:', userEmail);
  
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Error destroying session:', err);
      return res.status(500).json({ error: 'Sign-out failed' });
    }
    
    // Clear session cookie
    res.clearCookie('feedback.sid');
    res.status(200).json({ 
      message: 'Signed out successfully',
      userEmail: userEmail 
    });
  });
});

// ✅ GET SEMUA USER
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT userid, email, name, status, last_active FROM users ORDER BY userid ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Gagal ambil data user:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deactivated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('❌ Gagal menonaktifkan user:', error);
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// ✅ POST CRITIC - Dengan session validation
app.post('/critics', async (req, res) => {
  console.log('📥 Request ke /critics - Session:', req.session);
  console.log('📥 Headers:', req.headers);

  // Periksa apakah user sudah login
  if (!req.session || !req.session.userEmail || !req.session.isLoggedIn) {
    console.log('❌ User tidak login - Session:', req.session);
    return res.status(403).json({ 
      error: 'You must sign in to submit feedback',
      sessionStatus: req.session 
    });
  }

  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  try {
    // Cari user berdasarkan email yang ada di session
    const userResult = await pool.query(
      'SELECT userid, status FROM users WHERE email = $1', 
      [req.session.userEmail]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    const user = userResult.rows[0];

    // Cek jika profil pengguna lengkap (kolom profile_complete opsional; bila tidak ada dianggap true)
    const profileComplete = user.profile_complete !== false;
    if (!profileComplete) {
      return res.status(400).json({ 
        error: 'Your profile is incomplete. Please complete your profile first.' 
      });
    }

    // Cek status user
    if (user.status !== 'aktif') {
      return res.status(400).json({ 
        error: 'Your account is not active. Please contact the administrator.' 
      });
    }

    // Simpan kritik di database
    const result = await pool.query(
      'INSERT INTO critics (userid, content, datecreated) VALUES ($1, $2, NOW()) RETURNING *',
      [user.userid, content]
    );
    
    console.log('✅ Kritik berhasil disimpan untuk user:', req.session.userEmail);
    res.status(201).json({ 
      message: 'Feedback submitted successfully', 
      data: result.rows[0] 
    });
  } catch (err) {
    console.error('❌ Gagal simpan kritik:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ DELETE CRITIC BY ID
app.delete('/api/critics/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM critics WHERE criticid = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Feedback entry not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error('❌ Gagal hapus kritik:', err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// ✅ RUTE STATISTIK USER
app.use('/api/user-stats', userStatsRoute);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Hello from Express backend.');
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
    return res.status(400).json({ error: 'Incorrect captcha' });
  }
});

// ✅ GET PROFILE
app.get('/profile', async (req, res) => {
  const { email, name } = req.query;
  try {
    if (email) {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
      return res.status(404).json({ error: 'User not found with this email' });
    }

    if (name) {
      const result = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
      return res.status(404).json({ error: 'User not found with this name' });
    }

    return res.status(400).json({ error: 'Email or name must be provided' });
  } catch (err) {
    console.error('❌ Error saat mengambil data profil:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST PROFILE (REGISTER) - DENGAN PASSWORD HASHING
app.post('/profile', async (req, res) => {
  const { email, password, name } = req.body;

  console.log('📥 Data diterima dari frontend:', req.body);

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, name, status, last_active)
       VALUES ($1, $2, $3, 'aktif', NOW())
       RETURNING *`,
      [email, hashedPassword, name]
    );

    console.log('✅ Data berhasil disimpan ke DB:', result.rows[0]);

    res.status(201).json({ message: 'Profile saved successfully', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error('❌ Gagal simpan profil ke DB:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// ✅ LOGIN ADMIN
app.post('/login-admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Administrator not found' });
    }
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    res.json({ message: 'Sign-in successful', admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    console.error('Gagal login admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ CEK STATUS USER AKTIF/NONAKTIF
app.get('/auth/status', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  try {
    const result = await pool.query('SELECT status FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    const row = result.rows[0];
    return res.json({ 
      status: row.status,
      profile_complete: row.profile_complete !== false
    });
  } catch (err) {
    console.error('❌ Gagal cek status user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ DELETE USER BY ID
app.delete('/api/users/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE userid = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Gagal hapus user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`🔐 Session configured with name: feedback.sid`);
});