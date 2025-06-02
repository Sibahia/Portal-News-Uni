const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config/.env' });

function authenticationToken (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) { return res.status(403).json({ message: 'Token no proporcionado' }) };

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) { return res.status(403).json({ message: 'Token inválido o expirado' }) };

        req.user = user;
        next();
    });
}

module.exports = authenticationToken;