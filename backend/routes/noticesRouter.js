const express = require('express');
const router = express.Router();

const { sqlORM } = require('../models/database.js');

const NoticesDB = new sqlORM('./database/news.db');

router.get('/', (req, res) => {
    
    NoticesDB.getAll('notices')
    .then(news => res.status(200).send(JSON.stringify(news)))
    .catch(error => res.status(400).send(error.message))
})

router.post('/', (req, res) => {
    console.log(req.body)

    NoticesDB.insert('notices', {
        autor: '',
        title: req.body.title,
        content: req.body.content,
        time_created: ''
    });
    

    res.status(201).send(JSON.stringify('informacion guardada'));
});


module.exports = router;