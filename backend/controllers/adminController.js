const User = require('../models/user');
const Bank = require('../models/BankAccount');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {   
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error in fetching users' 
        });
    }
};

// get all bank accounts (admin only)
exports.getAllBankAccounts = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const accounts = await Bank.find();
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error in fetching bank accounts' 
        });
    }
};

