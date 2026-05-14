require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { analyzeGerberFiles } = require('./gerber');
const admin = require('firebase-admin');

try {
  const serviceAccount = require('./firebaseServiceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialisé avec succès.");
} catch (error) {
  console.error("Erreur d'initialisation de Firebase Admin:", error.message);
}

const db = admin.firestore();

const { Shwary, Country, TransactionStatus } = require('@shwary/node-sdk');

if (process.env.SHWARY_USE_SANDBOX) {
  process.env.SHWARY_SANDBOX = process.env.SHWARY_USE_SANDBOX;
}

Shwary.initFromEnvironment();

const countryEnumMap = {
  DRC: Country.DRC,
  KE: Country.KENYA,
  UG: Country.UGANDA
};

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

app.use(cors());
app.use(express.json());

const countryMeta = {
  DRC: { currency: 'CDF', prefix: '+243', rate: 2000, minAmount: 2900 },
  KE: { currency: 'KES', prefix: '+254', rate: 125, minAmount: 100 },
  UG: { currency: 'UGX', prefix: '+256', rate: 3800, minAmount: 100 }
};

const port = 5000;
const SHWARY_CALLBACK_URL = process.env.SHWARY_CALLBACK_URL || `http://localhost:${port}/api/shwary/callback`;

const uploadCallbacksFile = path.join(__dirname, 'shwary-callbacks.json');

function convertUsdToLocal(amountUsd, countryCode) {
  const config = countryMeta[countryCode];
  if (!config) {
    throw new Error(`Pays non supporté: ${countryCode}`);
  }
  return Math.max(config.minAmount, Math.round(amountUsd * config.rate));
}

function saveCallback(payload) {
  try {
    let callbacks = [];
    if (fs.existsSync(uploadCallbacksFile)) {
      const content = fs.readFileSync(uploadCallbacksFile, 'utf-8');
      callbacks = JSON.parse(content || '[]');
    }
    callbacks.push({ receivedAt: new Date().toISOString(), payload });
    fs.writeFileSync(uploadCallbacksFile, JSON.stringify(callbacks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Impossible de sauvegarder le callback Shwary :', err);
  }
}

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
    console.error('Erreur lors de l\'analyse Gerber:', error);
    res.status(500).json({ error: 'Erreur serveur lors du traitement des fichiers.' });
  }
});

app.post('/api/shwary/payment', async (req, res) => {
  try {
    const { amountUsd, clientPhoneNumber, countryCode } = req.body;
    if (!amountUsd || !clientPhoneNumber || !countryCode) {
      return res.status(400).json({ error: 'amountUsd, clientPhoneNumber et countryCode sont obligatoires.' });
    }

    const country = countryMeta[countryCode];
    if (!country) {
      return res.status(400).json({ error: 'Pays non supporté pour Shwary.' });
    }

    if (!clientPhoneNumber.startsWith(country.prefix)) {
      return res.status(400).json({ error: `Le numéro doit commencer par ${country.prefix}.` });
    }

    const shwaryAmount = convertUsdToLocal(amountUsd, countryCode);
    const shwaryCountryEnum = countryEnumMap[countryCode] || Country.DRC;

    // Le SDK Shwary exige une URL HTTPS valide.
    // Si on est en local (localhost) ou http, on doit l'omettre ou utiliser un ngrok.
    let validCallbackUrl = SHWARY_CALLBACK_URL;
    if (validCallbackUrl && !validCallbackUrl.startsWith('https://')) {
      console.warn("Shwary exige une URL HTTPS pour le webhook. Le callback est ignoré pour ce test local.");
      validCallbackUrl = undefined;
    }

    const transaction = await Shwary.pay(
      shwaryAmount,
      clientPhoneNumber,
      shwaryCountryEnum,
      validCallbackUrl
    );

    res.json({
      id: transaction.id,
      status: transaction.status,
      amount: shwaryAmount,
      currency: country.currency,
      countryCode
    });
  } catch (error) {
    console.error('Erreur Shwary:', error);
    res.status(500).json({ error: error.message || "Erreur lors de l'appel à l'API Shwary." });
  }
});

app.post('/api/shwary/callback', async (req, res) => {
  try {
    const transaction = Shwary.parseWebhook(JSON.stringify(req.body));
    saveCallback(transaction);
    console.log(`Callback Shwary reçu : ${transaction.id} - Statut : ${transaction.status}`);

    let newStatus = null;
    if (transaction.status === TransactionStatus.COMPLETED) {
      newStatus = 'paid';
    } else if (transaction.status === TransactionStatus.FAILED || transaction.status === 'cancelled') {
      newStatus = 'failed';
    }

    if (newStatus && db) {
      const ordersRef = db.collection('orders');
      const snapshot = await ordersRef.where('paymentSummary.transactionId', '==', transaction.id).get();

      if (!snapshot.empty) {
        const batch = db.batch();
        const orderId = snapshot.docs[0].id;

        // Mise à jour de la commande principale
        snapshot.forEach(doc => {
          batch.update(doc.ref, { status: newStatus });
        });

        // Mise à jour des pcb_orders associés
        const pcbOrdersSnapshot = await db.collection('pcb_orders').where('orderId', '==', orderId).get();
        pcbOrdersSnapshot.forEach(doc => {
          batch.update(doc.ref, { status: newStatus });
        });

        await batch.commit();
        console.log(`Statut Firestore mis à jour : ${orderId} -> ${newStatus}`);
      }
    }

    res.json(Shwary.webhook().createResponse(true));
  } catch (error) {
    console.error('Erreur callback Shwary:', error);
    res.status(400).json(Shwary.webhook().createResponse(false, error.message));
  }
});

app.listen(port, () => {
  console.log(`Backend PCB order API démarré sur http://localhost:${port}`);
});
