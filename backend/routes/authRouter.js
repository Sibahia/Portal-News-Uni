const express = require('express');
const authenticationToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authenticationToken, (req, res) => {
    res.status(200).json({ message: 'Perfil de Usuario', user: req.user});
});

module.exports = router;