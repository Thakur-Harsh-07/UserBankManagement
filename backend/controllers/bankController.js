const express = require('express');

const Bank = require('../models/BankAccount');

// Create a new bank account
exports.createBankAccount = async (req, res) => {
    try {
        const { ifscCode, branchName, bankName, accountNumber, accountHolderName } = req.body;
        const newBankAccount = new Bank({
            user: req.user.userId,
            ifscCode,
            branchName,
            bankName,
            accountNumber,
            accountHolderName
        });
        await newBankAccount.save();
        res.status(201).json({
             success: true,
             message: 'Bank account created successfully'
             });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Error in creating bank account' 
        });
    }
};
// Get all bank accounts for the logged-in user
exports.getBankAccounts = async (req, res) => {
    try {
        const { userId } = req.user;
        const bankAccounts = await Bank.find({ user: userId });
        return res.status(200).json(bankAccounts);

    }
    catch (error) {
        res.status(500).json({
             success: false,
             message: 'Server error' 
            });
    }
};
// Get a specific bank account by ID
exports.getBankAccountById = async (req, res) => {
    try {
        const bankAccount = await Bank.findById(req.params.id);
        if (!bankAccount) {
            return res.status(404).json({ message: 'Bank account not found' });
        }
        res.status(200).json(bankAccount);
    } catch (error) {
        res.status(500).json({
            success: false,
             message: 'Server error' 
            });
    }
};
// Delete a bank account by ID
exports.deleteBankAccount = async (req, res) => {
    try {
        const bankAccount = await Bank.findByIdAndDelete(req.params.id);
        if (!bankAccount) {
            return res.status(404).json({ message: 'Bank account not found' });
        }
        res.status(200).json({ message: 'Bank account deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error in deleting bank account'
        }); 
    }
};

// Update a bank account by ID
exports.updateBankAccount = async (req, res) => {
    try {   
        const { ifscCode, branchName, bankName,  accountNumber, accountHolderName } = req.body;
        const bankAccount = await Bank.findById(req.params.id);
        if (!bankAccount) {
            return res.status(404).json({ message: 'Bank account not found' });
        }
        bankAccount.ifscCode = ifscCode || bankAccount.ifscCode;
        bankAccount.branchName = branchName || bankAccount.branchName;
        bankAccount.bankName = bankName || bankAccount.bankName;
        bankAccount.accountNumber = accountNumber || bankAccount.accountNumber;
        bankAccount.accountHolderName = accountHolderName || bankAccount.accountHolderName;
        await bankAccount.save();
        res.status(200).json({ message: 'Bank account updated successfully' });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error in updating bank account' 
        });
    }
};

