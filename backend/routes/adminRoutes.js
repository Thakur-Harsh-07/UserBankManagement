const express = require('express');
const router = express.Router();
const {getAllBankAccounts} = require('../controllers/adminController');
const{getAllUsers} = require('../controllers/adminController');
const authMiddleware  = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/authMiddleware').isAdmin;
// Route to get all users (admin only)
router.get('/users', authMiddleware, isAdmin, getAllUsers);
// Route to get all bank accounts (admin only)
router.get('/bank-accounts', authMiddleware, isAdmin, getAllBankAccounts);
module.exports = router;