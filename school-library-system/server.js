import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("Library Server Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/add-test-users", async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO users (personal_code, role)
      VALUES 
      ('1315', 'user'),
      ('0000', 'admin')
      ON CONFLICT (personal_code) DO NOTHING;
    `);

    res.send("test users added");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});