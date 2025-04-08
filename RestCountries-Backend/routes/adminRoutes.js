const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/api-keys', adminController.getAllApiKeys);

module.exports = router;
