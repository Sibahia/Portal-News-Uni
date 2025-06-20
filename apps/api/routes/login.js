const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config({ path: '../config/.env' });

const { sqlORM } = require('../models/database');
const dbSQL = new sqlORM('./database/news.db');

router.post('/', async (req, res) => {
    try {
        const { user, password } = req.body;

        console.log({ user, password })

        if (!user || !password) { return res.status(400).json({ message: 'Se requiere usuario y contraseña' }); };

        const foundUser = await dbSQL.find('users', { user });
        
        if (!foundUser) { return res.status(404).json({ message: 'Usuario no encontrado' }); };

        const validPassword = await bcrypt.compare(password, foundUser.password);

        if (!validPassword) { return res.status(404).json({ message: 'Contraseña incorrecta' }); };

        const token = jwt.sign({ user: foundUser.user }, process.env.JWT_KEY, { expiresIn: '3d' });

        console.log({ token })

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch(error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    };
});

module.exports = router;