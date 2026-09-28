const jwt = require('jsonwebtoken');

function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
}

function authenticateJWT(req, res, next) {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}

module.exports = authenticateJWT;
module.exports.verifyToken = verifyToken;
