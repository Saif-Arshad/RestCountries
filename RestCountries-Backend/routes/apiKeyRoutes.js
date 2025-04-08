
const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');

function loginRequired(req, res, next) {
    if (!req.session.user_id)
        return res.status(401).json({ error: "User not logged in." });
    next();
}

router.post('/', loginRequired, apiKeyController.generateApiKey);
router.get('/', loginRequired, apiKeyController.listApiKeys);
router.delete('/:key', loginRequired, apiKeyController.revokeApiKey);

module.exports = router;
