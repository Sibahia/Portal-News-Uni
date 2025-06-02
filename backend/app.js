const express = require('express');
const cors = require('cors');

const { sqlORM } = require('./models/database.js');

const app = express();
const PORT = 3000;

const noticesRouter = require('./routes/noticesRouter.js');
const loginRouter = require('./routes/loginRouter.js');
const authRouter = require('./routes/authRouter.js');

const CORS_OPTIONS = {
    'origin': '*',
    'methods': ['GET', 'POST', 'DELETE']
}

app.use(express.json());
app.use(cors(CORS_OPTIONS));

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
});

app.use('/api/notices', noticesRouter);
app.use('/auth/login', loginRouter)
app.use('/auth', authRouter);

const Notices = new sqlORM('./database/news.db');

const dbSchema = {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    autor: 'TEXT NOT NULL',
    title: 'TEXT NOT NULL',
    content: 'TEXT NOT NULL',
    time_created: 'TEXT NOT NULL'
}

Notices.define('notices', dbSchema);
Notices.define('users', {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    user: 'TEXT NOT NULL',
    username: 'TEXT NOT NULL',
    password: 'TEXT NOT NULL'
});

app.get('/', (req, res) => {
    res.status(200).send(JSON.stringify('Servers on'));
});

