
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const ALLOWED_ROLES = ["locataire", "proprietaire"];

// Génération du JWT
function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET est manquant dans le fichier .env");
  }

  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
}

// ==============================
// INSCRIPTION
// ==============================
export async function register(req, res) {
  try {
    const { name, role, phone, email, password } = req.body;

    // Vérification des champs obligatoires
    if (!name || !role || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires.",
      });
    }

    // Normalisation
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || null;

    // Validation du nom
    if (cleanName.length < 2 || cleanName.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Le nom doit contenir entre 2 et 120 caractères.",
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 190) {
      return res.status(400).json({
        success: false,
        message: "Adresse email invalide.",
      });
    }

    // Validation rôle
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Type de compte invalide.",
      });
    }

    // Validation téléphone
    if (cleanPhone && cleanPhone.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Le numéro de téléphone est trop long.",
      });
    }

    // Validation mot de passe
    if (
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères et ne pas dépasser 72 octets.",
      });
    }

    // Vérifier si l'email existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Enregistrer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (
        name,
        email,
        password,
        phone,
        role,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, name, email, phone, role, created_at`,
      [cleanName, cleanEmail, hashedPassword, cleanPhone, role]
    );

    const user = result.rows[0];

    // Générer le token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Votre compte a été créé avec succès.",
      token,
      user,
    });

  } catch (error) {
    console.error("Erreur inscription :", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Une erreur interne est survenue.",
    });
  }
}

// ==============================
// CONNEXION
// ==============================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez saisir votre email et votre mot de passe.",
      });
    }

    // Normalisation
    const cleanEmail = email.trim().toLowerCase();

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      typeof email !== "string" ||
      !emailRegex.test(cleanEmail) ||
      cleanEmail.length > 190 ||
      typeof password !== "string" ||
      !password.length ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Données de connexion invalides.",
      });
    }

    // Rechercher l'utilisateur
    const result = await pool.query(
      `SELECT id, name, email, phone, role, password
       FROM users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [cleanEmail]
    );

    const user = result.rows[0];

    // Vérifier les identifiants
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    // Générer le JWT
    const token = generateToken(user);

    // Ne jamais retourner le hash du mot de passe
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error("Erreur connexion :", error);

    return res.status(500).json({
      success: false,
      message: "Une erreur interne est survenue.",
    });
  }
}
