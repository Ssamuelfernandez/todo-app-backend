# **API ToDo - Documentación de Uso**

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
  "firstName": "string",
  "email": "string",
  "password": "string"
}
```
**Respuesta Exitosa:**
```bash
{
  "message": "User registered successfully",
  "userId": "user_id"
}
```
**Errores Comunes:**

`400 Bad Request`: Campos requeridos faltantes o email ya registrado.

### **Inicio de Sesión**

Permite a los usuarios autenticarse y obtener un token de acceso.

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



## **Peticiones a la Api**

### **Obtener Todos los ToDos**

Puedes obtener todos los ToDos almacenados sin aplicar ningún filtro:

**Endpoint:** `GET /todos`

**Ejemplo de Solicitud:**

```bash
GET /todos
```

### **Filtrar ToDos**

La API te permite filtrar los ToDos usando parámetros de consulta (query parameters). A continuación, se detallan los filtros disponibles y cómo utilizarlos.

#### **Filtros Disponibles:**

1. **Estado (`status`)**
   - Filtra los ToDos según su estado.
   - Valores permitidos: `Pending`, `In Progress`, `Completed`
   - **Ejemplo:** `GET /todos?status=Completed`

2. **Prioridad (`priority`)**
   - Filtra los ToDos según su prioridad.
   - Valores permitidos: `Low`, `Medium`, `High`
   - **Ejemplo:** `GET /todos?priority=High`

3. **Categoría (`category`)**
   - Filtra los ToDos por categoría.
   - Valores permitidos: `Work`, `Personal`, `Shopping`, `Health`, `Finance`, `Education`, `Social`, `Travel`, `Hobby`, `Errands`, `Others`
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

### **Notas**

  #### **Parámetros de Consulta:** 
  Los parámetros de consulta son opcionales. Si no se especifican, se devolverán todos los ToDos.
  #### **Formato de Fecha:** 
  Asegúrate de usar el formato de fecha YYYY-MM-DD para los filtros relacionados con fechas.
  #### **Token de Autenticación:**
  Para acceder a las rutas protegidas, incluye el token JWT en el encabezado `Authorization` de la solicitud. El formato del encabezado debe ser `Authorization: Bearer {jwt_token}`.
