
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Vérifier les variables essentielles
if (!process.env.JWT_SECRET || !process.env.DB_PASSWORD) {
  throw new Error("Configuration manquante dans le fichier .env");
}

// Middlewares
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

// Route de vérification
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API Trano opérationnelle.",
  });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Route inconnue
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route introuvable.",
  });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`Serveur Trano démarré : http://localhost:${PORT}`);
});
