require("dotenv").config();

const express = require("express");
const cors = require("cors");
const librosRoutes = require("./src/routes/libros.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use("/libros", librosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
