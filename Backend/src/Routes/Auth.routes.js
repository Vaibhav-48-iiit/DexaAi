const express = require('express');
const authrouter = express.Router();
const authmiddleware = require('../middleware/auth.middleware');

const authcontroller = require('../Controllers/Auth.controller');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

authrouter.post('/register', authcontroller.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

authrouter.post('/login', authcontroller.loginUser);

/**
 * @route GET /api/auth/logout
 * @desc Logout a user or clear cokies and add token to blacklist
 * @access Public
 */
    
authrouter.get('/logout', authcontroller.logoutUser);


/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user proile
 * @access Private
 */

authrouter.get('/get-me', authmiddleware.authenticateToken, authcontroller.getMe);

module.exports = authrouter;