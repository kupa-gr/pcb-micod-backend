const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { analyzeGerberFiles } = require('./gerber');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

app.use(cors());
app.use(express.json());

app.post('/api/upload', upload.array('gerberFiles'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier Gerber reçu.' });
    }

    const board = await analyzeGerberFiles(req.files);

    res.json({
      board,
      files: req.files.map((file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur lors du traitement des fichiers.' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend PCB order API démarré sur http://localhost:${port}`);
});
