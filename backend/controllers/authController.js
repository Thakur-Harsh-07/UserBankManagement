const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body; 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
        await newUser.save();
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error in user creation' 
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
             success: true,
             message: 'Login successful',
             token 
            });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {  
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: ' error in getting profile details' 
        });
    }   
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }   
};

