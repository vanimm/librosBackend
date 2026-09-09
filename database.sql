CREATE DATABASE IF NOT EXISTS backend_libros;

USE backend_libros;

CREATE TABLE IF NOT EXISTS libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  editorial VARCHAR(100) NOT NULL
);

INSERT INTO libros (titulo, autor, editorial) VALUES
('El Principito', 'Antoine de Saint-Exupéry', 'Salamandra'),
('Cien años de soledad', 'Gabriel García Márquez', 'Sudamericana');
