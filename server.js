const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// API routes
const booksRoutes = require("./routes/books");
app.use("/api/books", booksRoutes);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
