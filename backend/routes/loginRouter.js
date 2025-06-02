const express = require('express');
const createUser = require('../controllers/createUser');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { user, username, password } = req.body;

        if (!user || !username || !password) {
            return res.status(400).json({ message: 'Faltan datos: user, username y password son obligatorios.' });
        }

        await createUser({ user, username, password }, req, res);

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
});

module.exports = router;
