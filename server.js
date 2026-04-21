const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
    res.send("Backend PCB fonctionne 🚀");
});

// Port (IMPORTANT pour Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Serveur démarré sur le port " + PORT);
});