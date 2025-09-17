const express = require("express");
const router = express.Router();
const pool = require("../db");

pool.query(`
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
  )
`);

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM books ORDER BY id ASC");
  res.json(result.rows);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  if (result.rows.length === 0) return res.status(404).json({ msg: "Book not found" });
  res.json(result.rows[0]);
});

router.post("/", async (req, res) => {
  const { title, author } = req.body;
  const result = await pool.query(
    "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
    [title, author]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const result = await pool.query(
    "UPDATE books SET title=$1, author=$2 WHERE id=$3 RETURNING *",
    [title, author, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ msg: "Book not found" });
  res.json(result.rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM books WHERE id=$1 RETURNING *", [id]);
  if (result.rows.length === 0) return res.status(404).json({ msg: "Book not found" });
  res.json({ msg: "Book deleted" });
});

module.exports = router;
