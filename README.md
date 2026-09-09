# Backend Libros — Guía educativa

API REST sencilla para administrar **libros**.

No hay frontend: todo se prueba con **Postman**.

---

## A. Qué estamos construyendo

Una API REST que permite:

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
Memory (array)  ó  MySQL
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

## E. Memoria vs persistencia

### Etapa 1 — Array en memoria (RAM)

Los libros se guardan en un array de JavaScript (`src/data/libros.memory.js`).

> **Los libros se almacenan temporalmente en memoria RAM. Si el servidor se reinicia, los datos se pierden.**

(Quedan solo los libros iniciales que están hardcodeados en el archivo.)

```text
Postman → Express → Controller → Array JS → RAM
```

### Etapa 2 — MySQL (disco)

Los libros se guardan en la base de datos. Sobreviven al reinicio del servidor.

```text
Postman → Express → Controller → MySQL → Disco
```

**Importante:** las URLs de Postman son **iguales** en ambas etapas.

---

## F. Prueba fundamental (demostración en clase)

### Con memoria (RAM)

1. Ejecutar `npm run dev`
2. Crear un libro con POST en Postman
3. Consultarlo con GET `/libros`
4. Modificar cualquier archivo del servidor y **guardar**
5. Ver en la terminal que **Nodemon reinicia**
6. Volver a hacer GET `/libros`
7. Observar que el libro creado **desapareció**

**Por qué:** Nodemon reinicia Node.js → el array se crea de nuevo → se pierden los datos nuevos.

### Con MySQL

1. Cambiar `USAR_MYSQL` a `true` en el controlador (ver más abajo)
2. Crear un libro con POST
3. Reiniciar el servidor (Ctrl+C y `npm run dev`, o guardar un archivo)
4. Hacer GET `/libros`
5. Comprobar que el libro **sigue existiendo**

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
│   │   ├── libros.memory.js
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

## Cómo ejecutar la versión en memoria

1. Abrí `src/controllers/libros.controller.js`
2. Verificá que diga:

```js
const USAR_MYSQL = false;
```

3. En la terminal:

```bash
cd backend-libros
npm run dev
```

4. Deberías ver:

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
7. En el backend, activá MySQL (paso siguiente)
8. Probá otra vez desde Postman

La conexión está en `src/database/mysql.js`:

- host: `localhost`
- user: `root`
- password: `""` (vacía, típico de XAMPP)
- database: `backend_libros`

---

## Cómo pasar de memoria a MySQL

**Un solo cambio:**

Archivo: `src/controllers/libros.controller.js`

```js
// Etapa 1 (memoria)
const USAR_MYSQL = false;

// Etapa 2 (MySQL)
const USAR_MYSQL = true;
```

Las rutas de Postman **no cambian**.

| Archivo | Rol |
| ------- | --- |
| `src/data/libros.memory.js` | Array en RAM |
| `src/data/libros.mysql.js` | Consultas SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) |
| `src/database/mysql.js` | Conexión / pool con `mysql2` |
| `database.sql` | Crear BD y tabla |

---

## Comprobar persistencia con MySQL

1. `USAR_MYSQL = true`
2. XAMPP MySQL encendido
3. `npm run dev`
4. POST un libro nuevo en Postman
5. GET `/libros` → aparece
6. Reiniciá el servidor
7. GET `/libros` otra vez → **sigue ahí**

Esa comparación (desaparece en RAM / permanece en MySQL) es el corazón de la demostración.
