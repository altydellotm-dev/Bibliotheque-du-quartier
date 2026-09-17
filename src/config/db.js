const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

let pool;

if (process.env.DATABASE_URL) {
  // Sur Render - on utilise DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // En local - on utilise DB_USER etc.
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

pool.on('connect', () => {
  console.log('Connecte a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erreur inattendue sur le pool PostgreSQL', err);
});

// Création automatique des tables si elles n'existent pas
(async () => {
  try {
    const sqlPath = path.join(__dirname, '../../schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('Tables verifiees / creees avec succes');
  } catch (err) {
    console.error('Erreur creation tables:', err.message);
  }
})();

module.exports = pool;
