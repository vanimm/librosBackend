const express = require("express");
const jwt = require("jsonwebtoken");
const {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  actualizarLibroParcial,
  eliminarLibro,
} = require("../controllers/libros.controller");

const router = express.Router();

function validarJwt(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  const token = header.split(" ")[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "demo-secret");
    if (!data || data.role !== "admin") {
      return res.status(403).json({ mensaje: "Token inválido o sin permisos" });
    }
    req.user = data;
    return next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}

router.get("/", obtenerLibros);
router.get("/:id", obtenerLibroPorId);
router.post("/", crearLibro);
router.put("/:id", actualizarLibro);
router.patch("/:id", actualizarLibroParcial);
// guia-seguimiento-diapositivas-ordenada.pdf
router.delete("/:id", validarJwt, eliminarLibro);

module.exports = router;
