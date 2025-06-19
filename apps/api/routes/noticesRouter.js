const express = require('express');
const router = express.Router();

const { sqlORM } = require('../models/database.js');
const upload = require('../middleware/multer.js');

const NoticesDB = new sqlORM('./database/news.db');

router.get('/', (req, res) => {
    
    NoticesDB.getAll('notices')
    .then(news => res.status(200).json({ notices: news }))
    .catch(error => res.status(400).json(error.message))
})

router.post('/', upload.single('image'), (req, res) => {
    const { title, autor, content, date } = req.body;

    NoticesDB.insert('notices', {
        autor: '',
        title: req.body.title,
        content: req.body.content,
        time_created: ''
    });
    

    res.status(201).json({message: 'informacion guardada'});
});


module.exports = router;