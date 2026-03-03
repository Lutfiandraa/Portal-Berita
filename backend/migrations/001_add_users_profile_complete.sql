-- Tambah kolom profile_complete dan created_at ke tabel users (jika belum ada).
-- Jalankan di pgAdmin / psql terhadap database portal_berita.

-- Kolom profile_complete: user yang sudah daftar lengkap = true
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT true;

-- Kolom created_at: untuk grafik user per bulan (user-stats)
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Set nilai default untuk baris yang sudah ada
UPDATE users SET profile_complete = true WHERE profile_complete IS NULL;
UPDATE users SET created_at = COALESCE(last_active, CURRENT_TIMESTAMP) WHERE created_at IS NULL;
