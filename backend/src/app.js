
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middlewares de sécurité et de traitement
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trano API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Route inconnue
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route introuvable.",
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);

  res.status(500).json({
    success: false,
    message: "Une erreur interne est survenue.",
  });
});

export default app;
