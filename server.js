import "dotenv/config";
import express from "express";
import cors from "cors";
import librosRoutes from "./src/routes/libros.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use("/libros", librosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
