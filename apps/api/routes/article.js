const express = require('express');
const router = express.Router();

const fs = require('fs')
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

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, autor, content } = req.body;

    if (isNaN(id) || !title || !autor || !content) {
      return res.status(400).json({ message: 'Datos incompletos o ID inválido' });
    }

    const result = await dbSQL.update(
      'notices',
      { title, autor, content },
      { id }
    );

    res.json({ success: true, message: 'Noticia actualizada', result });
  } catch (err) {
    console.error('Error en PUT /api/notices/article/:id:', err);
    res.status(500).json({ success: false, message: 'Error al actualizar la noticia' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    const notice = await dbSQL.find('notices', { id });
    if (!notice) return res.status(404).json({ message: 'Noticia no encontrada' });

    if (notice.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', notice.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await dbSQL.delete('notices', { id });

    res.json({ success: true, message: 'Noticia e imagen eliminadas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al eliminar noticia' });
  }
});

module.exports = router;