
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
} from "../controllers/auth.controller.js";

const router = Router();

// Limiteur pour l'inscription
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de tentatives d'inscription. Réessayez dans 15 minutes.",
  },
});

// Limiteur pour la connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

// POST /api/auth/register
router.post("/register", registerLimiter, register);

// POST /api/auth/login
router.post("/login", loginLimiter, login);

export default router;
