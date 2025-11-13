const express = require('express');
const router = express.Router();
 const {createBankAccount, getBankAccounts, getBankAccountById, deleteBankAccount, updateBankAccount} = require('../controllers/bankController');
 const  authMiddleware  = require('../middleware/authMiddleware');

// Route to create a new bank account
router.post('/addBank', authMiddleware, createBankAccount);

// Route to get all bank accounts for the logged-in user
router.get('/', authMiddleware, getBankAccounts); 

// Route to get a specific bank account by ID
router.get('/:id', authMiddleware, getBankAccountById);

// Route to delete a bank account by ID
router.delete('/:id', authMiddleware, deleteBankAccount);

// Route to update a bank account by ID
router.put('/:id', authMiddleware, updateBankAccount);
module.exports = router;