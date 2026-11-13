# Backend Libros — Guía educativa

API REST sencilla para administrar **libros**.

No hay frontend: todo se prueba con **Postman**.

---

## A. Qué estamos construyendo

Una API REST conectada a MySQL que permite:

- Listar libros
- Buscar un libro por ID
- Crear un libro
- Actualizar un libro
- Eliminar un libro

Campos de cada libro:

| Campo      | Tipo   | Descripción        |
| ---------- | ------ | ------------------ |
| `id`       | number | Se genera solo     |
| `titulo`   | string | Título del libro   |
| `autor`    | string | Autor              |
| `editorial`| string | Editorial          |

---

## B. Qué herramienta hace cada cosa

| Herramienta | Rol |
| ----------- | --- |
| **VS Code** | Donde escribimos el código |
| **Node.js** | Ejecuta JavaScript en la computadora |
| **NPM** | Administra dependencias (`express`, `mysql2`, `nodemon`, `dotenv`, `cors`) |
| **Nodemon** | Reinicia el servidor automáticamente al guardar cambios |
| **Express** | Facilita el servidor y las rutas HTTP |
| **Postman** | Simula al cliente: envía peticiones HTTP |
| **MySQL** | Guarda los datos de forma persistente |
| **XAMPP** | Entorno local para ejecutar MySQL |
| **dotenv** | Carga variables de entorno desde el archivo `.env` |
| **cors** | Controla qué origen frontend puede acceder a la API |

---

## C. Flujo de una petición

```text
Postman
   ↓
HTTP Request
   ↓
Node.js + Express (server.js)
   ↓
Route (libros.routes.js)
   ↓
Controller (libros.controller.js)
   ↓
MySQL
   ↓
HTTP Response (JSON)
   ↓
Postman
```

---

## D. CRUD

| Operación | Verbo HTTP | Ruta            |
| --------- | ---------- | --------------- |
| CREATE    | POST       | `/libros`       |
| READ      | GET        | `/libros`       |
| READ uno  | GET        | `/libros/:id`   |
| UPDATE    | PUT        | `/libros/:id`   |
| DELETE    | DELETE     | `/libros/:id`   |

---

## E. Almacenamiento en MySQL

Los libros se guardan en MySQL y permanecen allí aunque se reinicie el servidor.

```text
Postman → Express → Controller → MySQL → Disco
```

---

## Estructura del proyecto

```text
backend-libros/
├── package.json
├── server.js
├── README.md
├── database.sql
├── src/
│   ├── routes/
│   │   └── libros.routes.js
│   ├── controllers/
│   │   └── libros.controller.js
│   ├── data/
│   │   └── libros.mysql.js
│   └── database/
│       └── mysql.js
└── postman/
    └── libros.postman_collection.json
```

---

## Instalación (paso a paso)

Si partís de cero:

```bash
mkdir backend-libros
cd backend-libros
npm init -y
npm install express mysql2 dotenv cors
npm install --save-dev nodemon
```

En este proyecto las dependencias **ya están instaladas**.

### Configuración de entorno

El backend ahora usa `dotenv` para cargar un archivo `.env` y evita dejar credenciales y puertos en el código fuente.

Crear el entorno local:

```bash
cp .env.example .env
```

Archivo `.env` recomendado:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=backend_libros
CLIENT_ORIGIN=http://localhost:5173
```

`dotenv` inyecta esas variables en `process.env`, y el servidor lee `process.env.PORT` y `process.env.CLIENT_ORIGIN`. La conexión MySQL toma `process.env.DB_HOST`, `process.env.DB_USER`, `process.env.DB_PASSWORD` y `process.env.DB_NAME`.

### Scripts

| Comando        | Qué hace |
| -------------- | -------- |
| `npm start`    | Ejecuta `node server.js` una vez. Si cambiás código, tenés que reiniciar a mano. |
| `npm run dev`  | Ejecuta con **Nodemon**. Al guardar un archivo, reinicia solo. |

En clase usamos principalmente:

```bash
npm run dev
```

Para detener el servidor: **Ctrl + C**

---

## Ejecutar el backend

1. Verificá que MySQL esté iniciado y que exista la base de datos configurada.
2. En la terminal:

```bash
cd backend-libros
npm run dev
```

3. Deberías ver:

```text
Servidor ejecutándose en http://localhost:3000
```

### CORS y seguridad de origen

La API usa el middleware `cors` con un origen permitido explícito. Esto protege el acceso a la API y evita permitir cualquier origen como `*`.

```js
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
```

---

## Probar con Postman

### Importar la colección

1. Abrí Postman
2. Import → File → elegí `postman/libros.postman_collection.json`

### Endpoints

#### 1. GET todos los libros

`GET http://localhost:3000/libros`  
Respuesta esperada: **200 OK** (array JSON)

#### 2. GET libro por ID

`GET http://localhost:3000/libros/1`  
Respuesta esperada: **200 OK** o **404** si no existe

#### 3. POST crear libro

`POST http://localhost:3000/libros`  

Body (raw → JSON):

```json
{
  "titulo": "Rayuela",
  "autor": "Julio Cortázar",
  "editorial": "Alfaguara"
}
```

Respuesta esperada: **201 Created**

#### 4. PUT actualizar libro

`PUT http://localhost:3000/libros/3`

```json
{
  "titulo": "Rayuela (edición revisada)",
  "autor": "Julio Cortázar",
  "editorial": "Alfaguara"
}
```

Respuesta esperada: **200 OK**

#### 5. DELETE eliminar libro

`DELETE http://localhost:3000/libros/3`  
Respuesta esperada: **200 OK**

### Códigos HTTP usados

| Código | Cuándo |
| ------ | ------ |
| 200    | GET / PUT / DELETE exitosos |
| 201    | POST exitoso |
| 400    | Datos inválidos o incompletos |
| 404    | Libro inexistente |
| 500    | Error del servidor (ej. MySQL caído) |

---

## Configurar MySQL con XAMPP

1. Abrí **XAMPP Control Panel**
2. Iniciá el módulo **MySQL** (Start)
3. Abrí **phpMyAdmin** (botón Admin, o `http://localhost/phpmyadmin`)
4. Andá a la pestaña **SQL**
5. Copiá y ejecutá el contenido de `database.sql`
6. Comprobá que exista la base `backend_libros` y la tabla `libros`
7. Configurá las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_PORT` en `.env`
8. Ejecutá el backend y probá desde Postman

La conexión está en `src/database/mysql.js`:

- host: `DB_HOST`
- user: `DB_USER`
- password: `DB_PASSWORD`
- database: `DB_NAME`
- port: `DB_PORT` (opcional; por defecto `3306`)

| Archivo | Rol |
| ------- | --- |
| `src/data/libros.mysql.js` | Consultas SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) |
| `src/database/mysql.js` | Conexión / pool con `mysql2` |
| `database.sql` | Crear BD y tabla |

---

## Comprobar persistencia con MySQL

1. Asegurate de que MySQL esté encendido y el `.env` tenga los datos de conexión correctos.
2. Ejecutá `npm run dev`.
3. Creá un libro con POST en Postman y consultá con GET `/libros`.
4. Reiniciá el servidor y consultá nuevamente: el libro debe seguir en la base de datos.
