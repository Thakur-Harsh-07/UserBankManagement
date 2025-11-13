const express = require('express');
const router = express.Router();
const{register, login, getProfile,updateProfile, deleteProfile } = require('../controllers/authController');
const  authMiddleware  = require('../middleware/authMiddleware');
// User registration route
router.post('/register', register);
// User login route
router.post('/login', login);
// Get user profile route
router.get('/profile', authMiddleware, getProfile);
// Update user profile route
router.put('/profile', authMiddleware, updateProfile);
// Delete user profile route
router.delete('/profile', authMiddleware, deleteProfile);
module.exports = router;