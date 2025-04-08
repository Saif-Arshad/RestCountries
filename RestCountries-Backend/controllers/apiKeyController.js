const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const DB_NAME = 'restCountries.db';


const db = new sqlite3.Database(DB_NAME);

exports.generateApiKey = (req, res) => {
    const { id } = req.params;
    const userId = id
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "API key name is required." });

    const newKey = uuidv4();
    const sql = "INSERT INTO api_keys (user_id, api_key, name) VALUES (?, ?, ?)";

    db.run(sql, [userId, newKey, name], function (err) {
        if (err) return res.status(500).json({ error: "Database error." });
        res.status(201).json({ api_key: newKey, name });
    });
};

exports.listApiKeys = (req, res) => {
    const { id } = req.params;
    const userId = id
    const sql = "SELECT api_key, name FROM api_keys WHERE user_id = ?";
    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json({ api_keys: rows });
    });
};

exports.revokeApiKey = (req, res) => {
    const keyToRevoke = req.params.key;
    const sql = "DELETE FROM api_keys WHERE api_key = ?";
    db.run(sql, [keyToRevoke], function (err) {
        if (err) return res.status(500).json({ error: "Database error." });
        if (this.changes === 0)
            return res.status(404).json({ error: "API key not found or not owned by you." });
        res.json({ message: `API key ${keyToRevoke} revoked.` });
    });
};
