const pool = require("../database/mysql");

async function obtenerTodos() {
  const [filas] = await pool.query(
    "SELECT id, titulo, autor, editorial FROM libros"
  );
  return filas;
}

async function obtenerPorId(id) {
  const [filas] = await pool.query(
    "SELECT id, titulo, autor, editorial FROM libros WHERE id = ?",
    [id]
  );
  return filas[0] || null;
}

async function crear(datos) {
  const [resultado] = await pool.query(
    "INSERT INTO libros (titulo, autor, editorial) VALUES (?, ?, ?)",
    [datos.titulo, datos.autor, datos.editorial]
  );

  return {
    id: resultado.insertId,
    titulo: datos.titulo,
    autor: datos.autor,
    editorial: datos.editorial,
  };
}

async function actualizar(id, datos) {
  const [resultado] = await pool.query(
    "UPDATE libros SET titulo = ?, autor = ?, editorial = ? WHERE id = ?",
    [datos.titulo, datos.autor, datos.editorial, id]
  );

  if (resultado.affectedRows === 0) {
    return null;
  }

  return {
    id,
    titulo: datos.titulo,
    autor: datos.autor,
    editorial: datos.editorial,
  };
}

async function eliminar(id) {
  const [resultado] = await pool.query("DELETE FROM libros WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
