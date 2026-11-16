import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Vérifier les variables essentielles
if (!process.env.JWT_SECRET || !process.env.DB_PASSWORD) {
  throw new Error("Configuration manquante dans le fichier .env");
}

app.listen(PORT, () => {
  console.log(`Serveur Trano démarré : http://localhost:${PORT}`);
});
