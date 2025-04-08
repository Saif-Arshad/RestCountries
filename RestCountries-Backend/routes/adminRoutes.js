const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

function adminRequired(req, res, next) {
    if (!req.session.role || req.session.role !== 'admin')
        return res.status(403).json({ error: "Admin privileges required." });
    next();
}

router.get('/users', adminRequired, adminController.getAllUsers);
router.get('/api-keys', adminRequired, adminController.getAllApiKeys);

module.exports = router;
