// 1) Importamos Express para crear el router.
import express from "express";
// 2) Importamos JWT para verificar tokens en rutas protegidas.
import jwt from "jsonwebtoken";
// 3) Importamos las funciones del controlador que manejan cada petición.
import {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  actualizarLibroParcial,
  eliminarLibro,
} from "../controllers/libros.controller.js";

// 4) Creamos un router de Express para agrupar rutas relacionadas con libros.
const router = express.Router();

// 5) Middleware para validar el token JWT antes de eliminar un libro.
function validarJwt(req, res, next) {
  // 5.1) Leemos el header Authorization.
  const header = req.headers.authorization;
  // 5.2) Validamos que venga el formato "Bearer <token>".
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  // 5.3) Extraemos el token real.
  const token = header.split(" ")[1];
  try {
    // 5.4) Verificamos y decodificamos el token usando la clave secreta.
    const data = jwt.verify(token, process.env.JWT_SECRET || "demo-secret");
    // 5.5) Validamos que el usuario tenga rol de administrador.
    if (!data || data.role !== "admin") {
      return res.status(403).json({ mensaje: "Token inválido o sin permisos" });
    }
    // 5.6) Guardamos la info del usuario en la petición para uso posterior.
    req.user = data;
    // 5.7) Continuamos con la siguiente función del flujo.
    return next();
  } catch (error) {
    // 5.8) Si el token falla, respondemos con un error 401.
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}

// 6) GET /libros -> devuelve todos los libros.
router.get("/", obtenerLibros);
// 7) GET /libros/:id -> devuelve un libro por su id.
router.get("/:id", obtenerLibroPorId);
// 8) POST /libros -> crea un nuevo libro.
router.post("/", crearLibro);
// 9) PUT /libros/:id -> reemplaza totalmente un libro.
router.put("/:id", actualizarLibro);
// 10) PATCH /libros/:id -> actualiza solo ciertos campos.
router.patch("/:id", actualizarLibroParcial);
// 11) DELETE /libros/:id -> primero ejecuta validarJwt, luego elimina.
router.delete("/:id", validarJwt, eliminarLibro);

// 12) Exportamos el router para usarlo en server.js.
export default router;