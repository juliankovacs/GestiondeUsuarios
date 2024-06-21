# API de Gestión de Usuarios

Este proyecto proporciona una API en JavaScript para gestionar usuarios de una aplicación web, permitiendo operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los usuarios y asegurando la seguridad y validación de los datos.

## Funcionalidades

- **Crear Usuario**: Permite crear un nuevo usuario especificando nombre, correo electrónico y contraseña.
  
- **Obtener Usuarios**: Permite obtener todos los usuarios registrados.
  
- **Actualizar Usuario**: Permite actualizar el nombre, correo electrónico o contraseña de un usuario existente.
  
- **Eliminar Usuario**: Permite eliminar un usuario existente del sistema.
  
- **Validaciones**: 
  - Asegura que los correos electrónicos sean únicos en el sistema.
  - Aplica criterios de seguridad para las contraseñas, asegurando que cumplan con requisitos mínimos.
  
- **Middleware de Autenticación**: Implementa un middleware que verifica si el usuario está autenticado antes de permitir operaciones sensibles como actualizar o eliminar usuarios.

- **Middleware de Registro de Solicitudes**: Registra todas las solicitudes de actualización y eliminación de usuarios, guardando información sobre la operación y la fecha en que se realizó.

## Requisitos del Sistema

Para utilizar esta API de Gestión de Usuarios, asegúrate de tener instalado Node.js y npm. Además, se utilizan las siguientes tecnologías y dependencias:

- **Node.js**
- **Express.js** (para la implementación del servidor y las rutas)
- **JavaScript**

