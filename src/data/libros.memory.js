// Memoria volátil: los datos viven en la RAM.
// Si el servidor se reinicia, este array se crea de nuevo.

let siguienteId = 3;

const libros = [
  {
    id: 1,
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    editorial: "Salamandra",
  },
  {
    id: 2,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    editorial: "Sudamericana",
  },
];

function obtenerTodos() {
  return libros;
}

function obtenerPorId(id) {
  return libros.find((libro) => libro.id === id);
}

function crear(datos) {
  const nuevoLibro = {
    id: siguienteId++,
    titulo: datos.titulo,
    autor: datos.autor,
    editorial: datos.editorial,
  };
  libros.push(nuevoLibro);
  return nuevoLibro;
}

function actualizar(id, datos) {
  const indice = libros.findIndex((libro) => libro.id === id);
  if (indice === -1) {
    return null;
  }

  libros[indice] = {
    id,
    titulo: datos.titulo,
    autor: datos.autor,
    editorial: datos.editorial,
  };

  return libros[indice];
}

function eliminar(id) {
  const indice = libros.findIndex((libro) => libro.id === id);
  if (indice === -1) {
    return false;
  }

  libros.splice(indice, 1);
  return true;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
