const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

// Middleware to authenticate user using JWT

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// for admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
};

module.exports = authMiddleware;
module.exports.isAdmin = isAdmin;