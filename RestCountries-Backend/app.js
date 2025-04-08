
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());
const DB_NAME = 'restCountries.db';
const db = new sqlite3.Database(DB_NAME);

function initDB() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        api_key TEXT NOT NULL UNIQUE,
        name TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    console.log("Database initialized!");
  });
}
initDB();

const authRoutes = require('./routes/authRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const countryRoutes = require('./routes/countryRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/countries', countryRoutes);
app.use('/admin', adminRoutes);
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
