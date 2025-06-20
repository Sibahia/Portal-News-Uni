const express = require('express');
const router = express.Router();

const { sqlORM } = require('../models/database.js');
const upload = require('../middleware/multer.js');

const dbSQL = new sqlORM('./database/news.db');

router.get('/', (req, res) => {
    
    dbSQL.getAll('notices')
    .then(news => {
        notices = news;
        return dbSQL.getAll('images');
    })
    .then(images => {
        const combined = notices.map(notice => {
            const noticeImages = images.filter(img => img.notice_id === notice.id).map(img => img.image_path)
            
            return {
                ...notice,
                image: noticeImages
            };
        });

        res.status(200).json({ notices: combined });
    })
    .catch(error => res.status(400).json(error.message))
});

router.post('/', upload.single('image'), (req, res) => {
    const { title, autor, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const date = new Date().toISOString().split('.')[0] + 'Z';

    dbSQL.insert('notices', {
        autor: autor,
        title: title,
        content: content,
        time_created: date
    })
    .then(noticeId => {
        if (imagePath) {
            return dbSQL.insert('images', {
                notice_id: noticeId,
                image_path: imagePath
            });
        }
    }).then(() => {
        res.status(201).json({ message: 'Noticia e imagen guardadas correctamente' });
    }).catch(error => {
        res.status(500).json({ error });
    });
});


module.exports = router;