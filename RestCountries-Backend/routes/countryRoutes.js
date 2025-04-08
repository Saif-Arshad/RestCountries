const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

function apiKeyRequired(req, res, next) {
    const apiKey = req.header('X-API-KEY');
    if (!apiKey) return res.status(401).json({ error: "Missing API key in 'X-API-KEY' header." });

    const sqlite3 = require('sqlite3').verbose();
    const DB_NAME = 'restCountries';
    const db = new sqlite3.Database(DB_NAME);

    db.get("SELECT user_id FROM api_keys WHERE api_key = ?", [apiKey], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error." });
        if (!row) return res.status(403).json({ error: "Invalid API key." });
        req.apiUserId = row.user_id;
        next();
    });
}

router.get('/', apiKeyRequired, countryController.getCountryInfo);

module.exports = router;
