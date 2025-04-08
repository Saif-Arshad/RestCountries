const sqlite3 = require('sqlite3').verbose();
const DB_NAME = 'restCountries.db';

const db = new sqlite3.Database(DB_NAME);

exports.getAllUsers = (req, res) => {
    const sql = "SELECT id, name, email, role FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ users: rows });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
    db.run(sql, [userId], function(err) {
        if (err) return res.status(500).json({ error: "Database error" });
        if (this.changes === 0) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    });
};

exports.getAllApiKeys = (req, res) => {
    const sql = `
    SELECT ak.api_key, ak.name, u.email 
    FROM api_keys ak 
    JOIN users u ON ak.user_id = u.id
  `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ api_keys: rows });
    });
};
