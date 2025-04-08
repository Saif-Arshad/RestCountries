
const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');

router.post('/:id', apiKeyController.generateApiKey);
router.get('/:id', apiKeyController.listApiKeys);
router.delete('/:key', apiKeyController.revokeApiKey);

module.exports = router;
