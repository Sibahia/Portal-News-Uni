const express = require('express');
const router = express.Router();

const { sqlORM } = require('../models/database.js');
const dbSQL = new sqlORM('./database/news.db');

router.get('/:id', (req, res) => {
    const { id } = req.params;

    dbSQL.find('notices', { id })
    .then(notice => {
        return dbSQL.find('images', { notice_id: id })
        .then(image => {
            const imagePath = image ? `http://localhost:3000${image.image_path}` : null;
            res.status(200).json({ notice: { ...notice, image: imagePath } });
        });
    })
    .catch(error => {
        res.status(404).json({ error: 'Noticia no encontrada', details: error });
    });
});

module.exports = router;