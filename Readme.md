# **API ToDo/Notes - Documentación de Uso**

## **Autenticación de Usuario**

La API utiliza autenticación basada en tokens JWT para proteger las rutas y asegurar que solo los usuarios autenticados puedan acceder a ciertos recursos. 
A continuación se detallan las rutas relacionadas con la autenticación:

### **Registro de Usuario**

Permite registrar un nuevo usuario en la aplicación.

- **Endpoint :** `POST /auth/register`

**Cuerpo de Solicitud:**

```bash
{
  "nickname": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "password": "string"
}
```
**Respuesta Exitosa:**
```bash
{
  "message": "User registered successfully, please verify your email",
  "userId": "user_id"
}
```
**Errores Comunes:**

`400 Bad Request`: Campos requeridos faltantes o email ya registrado.

### **Inicio de Sesión**

Permite a los usuarios autenticarse y obtener un token de acceso.

Es necesario que el usuario haya confirmado el email de verificación de la cuenta.

- **Endpoint :** `POST /auth/login`

**Cuerpo de Solicitud:**

```bash
{
  "email": "string",
  "password": "string"
}
```
**Respuesta Exitosa:**
```bash
{
  "token": "jwt_token"
}
```
**Errores Comunes:**

`400 Not Found`: Usuario no encontrado.

`404 Bad Request`: Credenciales inválidas.

### **Verificar token del usuario**

Permite verificar el token emitido.

- **Endpoint :** `GET /auth/verify-token`
- **Encabezado de Solicitud :** `Authorization: Bearer {jwt_token}`

**Respuesta Exitosa:**
```bash
{
  "valid": true
}
```
**Errores Comunes:**

`403 Forbidden`: Token expirado.

### **Cerrar Sesión**

Permite a los usuarios cerrar sesión. En esta implementación, se actualiza la fecha del último inicio de sesión del usuario, lo que invalida el token actual.

- **Endpoint :** `POST /auth/logout`
- **Encabezado de Solicitud :** `Authorization: Bearer {jwt_token}`

**Respuesta Exitosa:**
```bash
{
  "message": "Logged out successfully"
}
```

### **He olvidado la contraseña**

Envía un correo electrónico con un enlace para restablecer la contraseña del usuario.

- **Endpoint :** `GET /auth/forgot-password`

**Cuerpo de Solicitud:**

```bash
{
  "email": "string"
}
```
**Respuesta Exitosa:**
```bash
{
  "message": "Email sent with password reset instructions, you have 10 minutes to change it."
}
```

**Errores Comunes:**

`404 Not Found`: Usuario no encontrado con el correo electrónico proporcionado.

### **Restablecer Contraseña**

Permite a los usuarios restablecer su contraseña utilizando un token enviado por correo electrónico.

- **Endpoint :** `GET /auth/reset-password/:token`

**Cuerpo de Solicitud:**

```bash
{
  "newPassword": "string"
}
```
**Respuesta Exitosa:**
```bash
{
  "message": "message": "Password has been reset successfully"
}
```

**Errores Comunes:**

`400 Bad Request`: Token inválido o expirado.

### **Cambiar Contraseña**

Permite a los usuarios autenticados cambiar su contraseña actual.

- **Endpoint :** `GET /auth/change-password`
- **Encabezado de Solicitud :** `Authorization: Bearer {jwt_token}`

**Cuerpo de Solicitud:**

```bash
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
**Respuesta Exitosa:**
```bash
{
  "message": "Password changed successfully"
}
```

**Errores Comunes:**

`400 Bad Request`: La contraseña actual es incorrecta o los campos no son válidos.

`401 Unauthorized`: El token JWT no es válido o ha expirado.

### **Obtener Perfil del Usuario**

Permite a los usuarios obtener su perfil basado en el token de autenticación.

- **Endpoint :** `GET /auth/profile`
- **Encabezado de Solicitud :** `Authorization: Bearer {jwt_token}`

**Respuesta Exitosa:**
```bash
{
  "nickname": "string",
  "firstName": "string",
  "email": "string",
  "lastLogin": "ISO_date"
}
```
**Errores Comunes:**

`401 Unauthorized`: Token inválido o no proporcionado.

## **Variables de Entorno**

Antes de ejecutar el proyecto, asegúrate de configurar las siguientes variables de entorno. Puedes hacerlo creando un archivo .env en la raíz del proyecto o utilizando tu sistema de gestión de entornos preferido.

`MONGODB_URI`: Dirección de conexión a la base de datos MongoDB.

`SECRET_KEY`: Clave secreta utilizada para encriptación y JWT (o autenticación).

`RESEND_API_KEY`: Clave API para la integración con Resend (envío de correos electrónicos).

`CORS_ORIGINS`: Lista de orígenes permitidos para CORS.

`Encabezado para el resend`: Direccion del dominio que se va a usar.


## **Peticiones a la Api ToDo**

### **Obtener Todos los ToDos**

Puedes obtener todos los ToDos almacenados sin aplicar ningún filtro:

- **Endpoint:** `GET /todos`

**Respuesta Exitosa:**

```
{
    "title": "string",
    "description": "string",
    "status": "string",
    "completed": true/false,
    "priority": "string",
    "category": "string",
    "reminder": "2024-09-01T00:00:00.000Z",
    "dueDate": "2024-09-01T00:00:00.000Z",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-09-01T00:00:00.000Z",
    "updatedAt": "2024-09-01T00:00:00.000Z"
  }
```

### **Filtros Disponibles para Obtener ToDos**

La API te permite filtrar los ToDos usando parámetros de consulta (query parameters). A continuación, se detallan los filtros disponibles y cómo utilizarlos.

#### **Filtros Disponibles:**

1. **Estado (`status`)**
   - Filtra los ToDos según su estado.
   - Valores permitidos: `Pending`, `In Progress`, `Completed`
   - **Ejemplo:** `GET /todos?status=Completed`

2. **Prioridad (`priority`)**
   - Filtra los ToDos según su prioridad.
   - Valores permitidos: `Low`, `Medium`, `High`.
   - **Ejemplo:** `GET /todos?priority=High`

3. **Categoría (`category`)**
   - Filtra los ToDos por categoría.
   - Valores permitidos: `Work`, `Personal`, `Shopping`, `Health`, `Finance`, `Education`, `Social`, `Travel`, `Hobby`, `Errands`, `Others`.
   - **Ejemplo:** `GET /todos?category=Work`

4. **Fecha de Vencimiento (`dueDate`)**
   - Filtra los ToDos que vencen antes o después de una fecha específica.
   - Formato de fecha: `YYYY-MM-DD`
   - **Ejemplos:**
     - `GET /todos?dueBefore=2024-09-01`
     - `GET /todos?dueAfter=2024-09-01`

5. **Etiquetas (`tags`)**
   - Filtra los ToDos que contienen ciertas etiquetas.
   - **Ejemplo:** `GET /todos?tags=urgent,important` (devuelve los ToDos que tienen las etiquetas "urgent" o "important")

6. **Recordatorio (`reminder`)**
   - Filtra los ToDos con un recordatorio antes o después de una fecha específica.
   - Formato de fecha: `YYYY-MM-DD`
   - **Ejemplos:**
     - `GET /todos?reminderBefore=2024-09-01`
     - `GET /todos?reminderAfter=2024-09-01`

7. **Fecha de Creación (`createdAt`)**
   - Filtra los ToDos creados antes o después de una fecha específica.
   - Formato de fecha: `YYYY-MM-DD`
   - **Ejemplos:**
     - `GET /todos?createdBefore=2024-01-01`
     - `GET /todos?createdAfter=2024-01-01`


### **Ejemplos Combinados de Uso de Filtros**

Puedes combinar múltiples filtros en una sola solicitud para refinar aún más la búsqueda:

- **Ejemplo 1:** Obtener todos los ToDos en progreso y con alta prioridad.

  ```bash
  GET /todos?status=In Progress&priority=High
  ```

- **Ejemplo 2:** Obtener todos los ToDos de la categoría "Work" que tienen la etiqueta "urgent".

  ```bash
  GET /todos?category=Work&tags=urgent
  ```

- **Ejemplo 3:** Obtener todos los ToDos creados después del 1 de enero de 2024 y que tienen una fecha de vencimiento antes del 1 de septiembre de 2024.

  ```bash
  GET /todos?createdAfter=2024-01-01&dueBefore=2024-09-01
  ```

### **Obtener ToDo por ID**

Obtén un ToDo específico usando su ID.

- **Endpoint :** `GET /todos/:id`

**Respuesta Exitosa:**

```bash
{
  "title": "string",
  "description": "string",
  "status": "string",
  "completed": true/false,
  "priority": "string",
  "category": "string",
  "reminder": "2024-09-01T00:00:00.000Z",
  "dueDate": "2024-09-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-09-01T00:00:00.000Z",
  "updatedAt": "2024-09-01T00:00:00.000Z"
}
```
**Errores Comunes:**

`404 Not Found`: ToDo no encontrado o no autorizado.

### **Crear un Nuevo ToDo**

Crea un nuevo ToDo para el usuario autenticado.

- **Endpoint :** `POST /todos`

**Cuerpo de Solicitud:**

```bash
{
  "title": "string",
  "description": "string",
  "status": "string",
  "completed": true/false,
  "priority": "string",
  "category": "string",
  "reminder": "2024-09-01T00:00:00.000Z",
  "dueDate": "2024-09-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"]
}
```

**Respuesta Exitosa:**

```bash
{
  "message": "TODO created with Id {id}",
  "todo": {
    "title": "string",
    "description": "string",
    "status": "string",
    "completed": true/false,
    "priority": "string",
    "category": "string",
    "reminder": "2024-09-01T00:00:00.000Z",
    "dueDate": "2024-09-01T00:00:00.000Z",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-09-01T00:00:00.000Z",
    "updatedAt": "2024-09-01T00:00:00.000Z"
  }
```

**Errores Comunes:**

`400 Bad Request`: Campos requeridos faltantes o formato inválido.

### **Actualizar un ToDo**

Actualiza los detalles de un ToDo existente.

- **Endpoint :** `PATCH /todos/:id`

**Cuerpo de Solicitud:**

```bash
{
  "title": "string",
  "description": "string",
  "status": "string",
  "completed": true/false,
  "priority": "string",
  "category": "string",
  "reminder": "2024-09-01T00:00:00.000Z",
  "dueDate": "2024-09-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"]
}
```

**Respuesta Exitosa:**

```bash
{
  "message": "TODO with Id {id} updated successfully",
  "todo": {
    "title": "string",
    "description": "string",
    "status": "string",
    "completed": true/false,
    "priority": "string",
    "category": "string",
    "reminder": "2024-09-01T00:00:00.000Z",
    "dueDate": "2024-09-01T00:00:00.000Z",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-09-01T00:00:00.000Z",
    "updatedAt": "2024-09-01T00:00:00.000Z"
  }
```

**Errores Comunes:**

`404 Not Found`: ToDo no encontrado o no autorizado.

### **Eliminar un ToDo**

Elimina un ToDo específico usando su ID.

- **Endpoint :** `DELETE /todos/:id`

**Respuesta Exitosa:**

```bash
{
  "message": "TODO deleted successfully"
}
```

**Errores Comunes:**

`404 Not Found`: ToDo no o o no autorizado.



## **Peticiones a la Api Notes**

### **Obtener Todas las Notas**

Obtén todas las notas almacenadas en el sistema para el usuario autenticado.

- **Endpoint :** `GET /notes`

## **Filtros Disponibles para Obtener Notas**

Puedes filtrar las notas usando parámetros de consulta (query parameters) para afinar los resultados.

#### **Parámetros de Filtro:**

1. **Título (`title`)**

   - Filtra las notas que contengan ciertas palabras en el título.

   - **Ejemplo:** `GET /notes?title=work`

2. **Categoría (`category`)**

   - Filtra las notas según su categoría.

   - Valores permitidos: `Personal`, `Work`, `Ideas`, `Project`, `Meeting`, `Others`.

   - **Ejemplo:** `GET /notes?category=Work`

3. **Etiquetas (`tags`)**

   - Filtra las notas que contienen ciertas etiquetas.

   - Numero maximo de cinco etiquetas.

   - **Ejemplo:** `GET /notes?tags=urgent,important`

4. **Fecha de Creación (`createdBefore`, `createdAfter`)**

   - Filtra las notas según su fecha de creación.

   - Formato de fecha: YYYY-MM-DD


   - **Ejemplo:**

      - `GET /notes?createdBefore=2024-01-01`

      - `GET /notes?createdAfter=2024-01-01`

### **Ejemplos Combinados de Uso de Filtros**

- **Ejemplo 1:** Obtener todas las notas con la categoría "Work" y con la etiqueta "urgent".

  ```bash
  GET /notes?category=Work&tags=urgent
  ```

- **Ejemplo 2:** Obtener todas las notas creadas después del 1 de enero de 2024 y con la palabra clave "meeting" en el título.

  ```bash
  GET /notes?createdAfter=2024-01-01&title=meeting
  ```

### **Obtener Nota por ID**

Obtén una nota específica usando su ID.

- **Endpoint :** `GET /notes/:id`

**Respuesta Exitosa:**

```bash
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-09-01",
  "updatedAt": "2024-09-01"
}
```
**Errores Comunes:**

`404 Not Found`: Nota no encontrada o no autorizada.

### **Crear una Nueva Nota**

Crea una nueva nota para el usuario autenticado.

- **Endpoint :** `POST /notes`

**Cuerpo de Solicitud:**

```bash
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["tag1", "tag2"]
}
```

**Respuesta Exitosa:**

```bash
{
  "message": "Note created with Id {id}",
  "note": { "note_details" }
}
```

**Errores Comunes:**

`400 Bad Request`: Campos requeridos faltantes o formato inválido.

### **Actualizar Nota**

Actualiza los detalles de una nota existente.

- **Endpoint :** `PATCH /notes/:id`

**Cuerpo de Solicitud:**

```bash
{
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["tag1", "tag2"]
}
```

**Respuesta Exitosa:**

```bash
{
  "message": "Note with Id {id} updated successfully",
  "note": { "note_details" }
}
```

**Errores Comunes:**

`404 Not Found`: Nota no encontrada o no autorizada.

### **Eliminar Nota**

Elimina una nota específica usando su ID.

- **Endpoint :** `DELETE /notes/:id`

**Respuesta Exitosa:**

```bash
{
  "message": "Note deleted successfully"
}
```

**Errores Comunes:**

`404 Not Found`: Nota no encontrada o no autorizada.



## **Notas**

  ### **Parámetros de Consulta:** 
  Los parámetros de consulta son opcionales. Si no se especifican, se devolverán todos los items.
  ### **Formato de Fecha:** 
  Asegúrate de usar el formato de fecha YYYY-MM-DD para los filtros relacionados con fechas.
  ### **Token de Autenticación:**
  Para acceder a las rutas protegidas, incluye el token JWT en el encabezado `Authorization` de la solicitud. 
  
  El formato del encabezado debe ser `Authorization: Bearer {jwt_token}`.

  ## **Dependencias**

1. `bcryptjs`:

   Librería utilizada para el hashing y verificación de contraseñas. Se usa para encriptar contraseñas de usuarios antes de almacenarlas en la base de datos y para validarlas durante el proceso de autenticación.

2. `cors`:

   Middleware para habilitar y gestionar el CORS (Cross-Origin Resource Sharing), lo que permite que tu API sea accesible desde diferentes dominios o clientes.

3. `dotenv`:

   Herramienta que carga variables de entorno desde un archivo .env a process.env. Esto permite mantener configuraciones sensibles (como claves API y credenciales) fuera del código fuente.

4. `express`:

   Framework web minimalista para Node.js. Facilita la creación de servidores y la gestión de rutas, middlewares, y manejo de solicitudes y respuestas HTTP.

5. `jsonwebtoken`:

   Librería para generar y verificar tokens JWT (JSON Web Tokens), que se utilizan principalmente para autenticar usuarios de manera segura sin necesidad de almacenar sesiones en el servidor.


6. `mongodb`:

    Cliente oficial de MongoDB para Node.js. Proporciona métodos para conectarse y realizar operaciones en bases de datos MongoDB.

7. `mongoose`:

    ODM (Object Data Modeling) para MongoDB, que ofrece una abstracción de la base de datos y permite trabajar con datos utilizando esquemas y modelos, facilitando la interacción con MongoDB.

8. `nodemon`:

    Herramienta que reinicia automáticamente el servidor de Node.js cada vez que detecta cambios en los archivos del proyecto. Muy útil durante el desarrollo para mejorar la eficiencia.


9. `resend`:

    Cliente de Resend para enviar correos electrónicos mediante la API de Resend. Se utiliza para gestionar notificaciones por correo, como verificaciones de cuentas o restablecimiento de contraseñas.
