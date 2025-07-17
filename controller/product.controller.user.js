const users = require('../model/product.model.user.js');
const Token = require('../model/product.model.token.js'); // Import the Token model
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt'); // Use bcryptjs for hashing passwords
const jwt = require('jsonwebtoken');
const app = require('../server.js');
require('dotenv').config(); // Load environment variables

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const user = await users.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await users.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get user
const getUser = async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Find user by name or email from the JWT payload
        const user = await users.findOne({ 
            $or: [
                { name: req.user.user }, 
                { email: req.user.user }
            ]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword; // Store the hashed password
        const user = new users(req.body);
        user.set({password: hashedPassword}); // Ensure password is hashed before saving
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await users.findByIdAndUpdate(id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await users.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const authorizeUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // Use the user's name or email for the token payload
            const payload = { user: user.name || user.email };
            const accessToken = jwt.sign(payload, process.env.RANDOM_SECRET_KEY, { expiresIn: '15s' });
            const refreshToken = jwt.sign(payload, process.env.SECOND_RANDOM_SECRET_KEY, { expiresIn: '1d' });
            // Save the refresh token in the database
            const token = new Token(req.body);
            res.status(200).json({ message: `${user.name} authorized successfully`, accessToken, refreshToken, token});

        } else {
            return res.status(401).send('Invalid password');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//refresh token
const refreshTokens = (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.SECOND_RANDOM_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const payload = { user: user.user };
        const accessToken = jwt.sign(payload, process.env.RANDOM_SECRET_KEY, { expiresIn: '15s' });
        res.json({ accessToken });
    });
}


// Authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.RANDOM_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Export the controller functions
module.exports = {
    getAllUsers,
    getUserById,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    authorizeUser,
    authenticateToken
};





