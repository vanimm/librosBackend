const express = require("express");
const {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  actualizarLibroParcial,
  eliminarLibro,
} = require("../controllers/libros.controller");

const router = express.Router();

router.get("/", obtenerLibros);
router.get("/:id", obtenerLibroPorId);
router.post("/", crearLibro);
router.put("/:id", actualizarLibro);
router.patch("/:id", actualizarLibroParcial);
router.delete("/:id", eliminarLibro);

module.exports = router;
