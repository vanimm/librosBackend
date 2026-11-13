import * as datos from "../data/libros.mysql.js";

function validarLibro(body) {
  const { titulo, autor, editorial } = body;

  if (!titulo || !autor || !editorial) {
    return "titulo, autor y editorial son obligatorios";
  }

  if (
    typeof titulo !== "string" ||
    typeof autor !== "string" ||
    typeof editorial !== "string"
  ) {
    return "titulo, autor y editorial deben ser texto";
  }

  return null;
}

function validarCambiosLibro(body) {
  const camposPermitidos = ["titulo", "autor", "editorial"];
  const camposEnviados = Object.keys(body);

  if (camposEnviados.length === 0) {
    return "Debe enviar al menos un campo para actualizar";
  }

  if (camposEnviados.some((campo) => !camposPermitidos.includes(campo))) {
    return "Solo se pueden actualizar titulo, autor y editorial";
  }

  if (
    camposEnviados.some(
      (campo) => typeof body[campo] !== "string" || !body[campo].trim()
    )
  ) {
    return "Los campos enviados deben ser texto no vacío";
  }

  return null;
}

export async function obtenerLibros(req, res) {
  try {
    const libros = await datos.obtenerTodos();
    res.status(200).json(libros);
  } catch (error) {
    console.error("Error al obtener libros:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function obtenerLibroPorId(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número" });
    }

    const libro = await datos.obtenerPorId(id);

    if (!libro) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.status(200).json(libro);
  } catch (error) {
    console.error("Error al obtener libro:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function crearLibro(req, res) {
  try {
    const errorValidacion = validarLibro(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const libro = await datos.crear(req.body);

    res.status(201).json({
      mensaje: "Libro creado correctamente",
      libro,
    });
  } catch (error) {
    console.error("Error al crear libro:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function actualizarLibro(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número" });
    }

    const errorValidacion = validarLibro(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const libro = await datos.actualizar(id, req.body);

    if (!libro) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.status(200).json({
      mensaje: "Libro actualizado correctamente",
      libro,
    });
  } catch (error) {
    console.error("Error al actualizar libro:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function actualizarLibroParcial(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número" });
    }

    const errorValidacion = validarCambiosLibro(req.body);
    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const libroActual = await datos.obtenerPorId(id);
    if (!libroActual) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    const libro = await datos.actualizar(id, {
      titulo: req.body.titulo ?? libroActual.titulo,
      autor: req.body.autor ?? libroActual.autor,
      editorial: req.body.editorial ?? libroActual.editorial,
    });

    res.status(200).json({
      mensaje: "Libro actualizado correctamente",
      libro,
    });
  } catch (error) {
    console.error("Error al actualizar parcialmente el libro:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

export async function eliminarLibro(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ mensaje: "El id debe ser un número" });
    }

    const eliminado = await datos.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.status(200).json({ mensaje: "Libro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar libro:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}
