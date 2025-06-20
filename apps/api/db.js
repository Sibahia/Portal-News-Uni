const { sqlORM } = require('./models/database.js');
const dbSQL = new sqlORM('./database/news.db');

dbSQL.define('notices', {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    autor: 'TEXT NOT NULL',
    title: 'TEXT NOT NULL',
    content: 'TEXT NOT NULL',
    time_created: 'TEXT NOT NULL'
});

dbSQL.define('users', {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    user: 'TEXT NOT NULL',
    username: 'TEXT NOT NULL',
    password: 'TEXT NOT NULL'
});

dbSQL.define('images', {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    notice_id: 'INTEGER NOT NULL',
    image_path: 'TEXT NOT NULL'
}, [
    { column: 'notice_id', references: 'notices', refColumn: 'id' }
]);