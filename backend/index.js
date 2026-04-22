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

// Configuration de multer pour garder l'extension originale
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Rendre le dossier 'uploads' accessible publiquement
app.use('/uploads', express.static(uploadDir));

// Route de test
app.get("/", (req, res) => {
  res.send("Backend PCB order API fonctionne 🚀");
});

app.post('/api/upload', upload.array('gerberFiles'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier Gerber reçu.' });
    }

    const board = await analyzeGerberFiles(req.files);
    
    // Générer l'URL d'accès au fichier (on prend le premier pour la démo)
    const fileUrl = `http://localhost:3000/uploads/${req.files[0].filename}`;

    res.json({
      board,
      fileUrl,
      files: req.files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur lors du traitement des fichiers.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend PCB order API démarré sur http://localhost:${port}`);
});
