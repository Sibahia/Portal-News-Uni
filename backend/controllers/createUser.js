const Person = require('../models/Person');
const { sqlORM } = require('../models/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });

const dbUser = new sqlORM('./database/news.db');

function createUser(personData, req, res) {
    const person = new Person(personData.username, personData.user, personData.password);
    const validation = person.isValid();

    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    dbUser.find('users', { user: person.user })
        .then(user => {
            res.status(400).json({ message: 'El usuario ya está registrado', user });
        })
        .catch(async () => {
            await person.encryptPassword();

            dbUser.insert('users', { username: person.username, user: person.user, password: person.password });

            let token;
            try {
                token = jwt.sign({ username: person.username, user: person.user, password: person.password }, process.env.JWT_KEY, { expiresIn: '1h' });
            } catch(err) {
                return res.status(500).json({ message: 'Error al generar el token JWT', error: err.message})
            }

            res.status(201).json({ message: 'Usuario registrado exitosamente', token});
        });
}

module.exports = createUser;
