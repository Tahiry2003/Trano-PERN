
import pool from "../config/db.js";

// Récupérer le profil
export const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        city,
        bio,
        avatar_path,
        created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur récupération profil :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer le profil.",
    });
  }
};

// Modifier le profil
export const updateMyProfile = async (req, res) => {
  try {
    const { name, email, phone, city, bio } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof phone !== "string" || !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Le nom, l'email et le téléphone sont obligatoires.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Adresse email invalide.",
      });
    }

    if (typeof bio === "string" && bio.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "La biographie ne doit pas dépasser 1000 caractères.",
      });
    }

    const avatarPath = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : null;

    const result = await pool.query(
      `UPDATE users
       SET
         name = $1,
         email = $2,
         phone = $3,
         city = $4,
         bio = $5,
         avatar_path = COALESCE($6, avatar_path),
         updated_at = NOW()
       WHERE id = $7
       RETURNING
         id,
         name,
         email,
         phone,
         role,
         city,
         bio,
         avatar_path,
         created_at`,
      [
        name.trim(),
        normalizedEmail,
        phone.trim(),
        typeof city === "string" ? city.trim() || null : null,
        typeof bio === "string" ? bio.trim() || null : null,
        avatarPath,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès.",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Erreur modification profil :", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Impossible de modifier le profil.",
    });
  }
};
