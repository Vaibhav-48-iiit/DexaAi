const usermodel = require('../Models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../Models/blacklist.model');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access usrname, email, password from request body
 */

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await usermodel.findOne({
            $or: [{ username }, { email }]
        })
        if(existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new usermodel({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id },
            process.env.jwt_secret,
            { expiresIn: '2d' }
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({
            message: 'User registered successfully',
            user:{
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: 'Internal server error during registration' });
    }
}
/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access email, password from request body
 */

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await usermodel.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.jwt_secret,
            { expiresIn: '2d' }
        );

        res.cookie('token', token);

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Internal server error during login' });
    }
}

/**
 * @route POST /api/auth/logout
 * @desc Logout a user and add token in blacklist
 * @access Public
 */

async function logoutUser(req, res) {
    try {
        const token = req.cookies.token;
        if (token) {
            await tokenBlacklistModel.create({ token });
        }
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error("Logout error:", error);
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    }
}

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user details
 * @access Public
 */

async function getMe(req, res) {

    const userId = req.user.id;

    const user = await usermodel.findById(userId);

    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email
    }); 
}

module.exports = { registerUser, loginUser, logoutUser, getMe };   