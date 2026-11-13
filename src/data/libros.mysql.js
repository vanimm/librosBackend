import pool from "../database/mysql.js";

export async function obtenerTodos() {
  const [filas] = await pool.query(
    "SELECT id, titulo, autor, editorial FROM libros"
  );
  return filas;
}

export async function obtenerPorId(id) {
  const [filas] = await pool.query(
    "SELECT id, titulo, autor, editorial FROM libros WHERE id = ?",
    [id]
  );
  return filas[0] || null;
}

export async function crear(datos) {
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

export async function actualizar(id, datos) {
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

export async function eliminar(id) {
  const [resultado] = await pool.query("DELETE FROM libros WHERE id = ?", [id]);
  return resultado.affectedRows > 0;
}

export default {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
