
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
  console.log("Connexion PostgreSQL établie.");
});

pool.on("error", (error) => {
  console.error("Erreur PostgreSQL :", error);
});

export default pool;
