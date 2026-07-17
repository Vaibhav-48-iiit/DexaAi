const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../Models/blacklist.model');



async function authenticateToken(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    const tokenBlacklist = await tokenBlacklistModel.findOne({ token });
    if (tokenBlacklist) {
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { authenticateToken };
