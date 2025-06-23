const express = require('express');
const router = express.Router();
const fs = require('fs');

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

router.get('/filters', (req, res) => {
        const limit = parseInt(req.query.limit) || 8;

        dbSQL.findLimit('notices', limit)
        .then(news => {
            notices = news;
            return dbSQL.findLimit('images', limit)
        })
        .then(images => {
            const combined = notices.map(notice => {
                const noticeImages = images.filter(img => img.notice_id === notice.id).map(img => img.image_path)

                return {
                    ...notice,
                    image: noticeImages
                };
            });
            res.status(200).json({ notices: combined })
        })
        .catch(error => res.status(400).json(error.message))
});

router.post('/', upload.single('image'), (req, res) => {
    const { title, autor, content } = req.body;
    const imageFile = req.file;
    const imagePath = imageFile ? `/uploads/${imageFile.filename}` : null;
    const date = new Date().toISOString().split('.')[0] + 'Z';
    
    dbSQL.insert('notices', {
        autor,
        title,
        content,
        time_created: date
    })
    .then(noticeId => {
        if (imagePath) {
            return dbSQL.insert('images', {
            notice_id: noticeId,
            image_path: imagePath
            });
        }
    })
    .then(() => {
        res.status(201).json({ message: 'Noticia e imagen guardadas correctamente' });
    })
    .catch(error => {
        if (imageFile?.path) {
          fs.unlink(imageFile.path, err => {
            if (err) {
              console.log('Error al eliminar imagen tras fallo:', err.message);
            } else {
              console.log('Imagen eliminada tras fallo');
            }
          });
        };
    res.status(500).json({ error: 'Error al guardar noticia o imagen', details: error });
  });
});

router.post('/:id/image', upload.single('image'), (req, res) => {
    const noticeId = req.params.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imagePath) {
        return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen.' });
    }

    dbSQL.insert('images', {
        notice_id: noticeId,
        image_path: imagePath
    })
    .then(() => {
        res.status(201).json({ message: 'Imagen añadida correctamente a la noticia.' });
    })
    .catch(error => {
        res.status(500).json({ message: 'Error al guardar la imagen', error });
    });
});

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió imagen' });

  const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;
  res.status(200).json({ url: imagePath }); 
});

router.delete('/delete-image/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../public/uploads', filename);

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error eliminando imagen:', err);
                return res.status(500).json({ error: 'Error eliminando imagen' });
            }
            res.status(200).json({ message: 'Imagen eliminada correctamente' });
        });
    } else {
        res.status(404).json({ error: 'Imagen no encontrada' });
    };
});



module.exports = router;