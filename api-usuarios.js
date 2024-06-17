const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Llave secreta para firmar (debería ser más segura en un entorno real)
const secretKey = 'mysecretkey';

function verificarAutenticacion(req, res, next) {
    // Obtener el token de autorización del encabezado HTTP
    const token = req.headers.authorization;

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, secretKey);

        // El token es válido, se puede proceder
        next();
    } catch (error) {
        // Error en la verificación del token
        return res.status(401).json({ mensaje: 'Acceso denegado. Token inválido.' });
    }
}

// Parseamos los datos a json()
app.use(express.json())

// Middleware de registro de tiempo
app.use((req, res, next) => {
    const tiempo = new Date();
    console.log(`Solicitud recibida: ${tiempo}`);
    console.log(`Consulta realizada al endpoint: ${req.path}`);
    console.log(`Metodo HTTP: ${req.method}`);
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

// Base de datos simulada de usuarios
const usuarios = [
    { id: 1, nombre: 'Cavani', correo: 'cavani@gmail.com', password:1234},
    { id: 2, nombre: 'Merentiel', correo: 'merentiel@gmail.com', password:1234 },
    { id: 3, nombre: 'Advincula', correo: 'advincula@gmail.com', password:1234 }
];

// Middleware para validar correo electrónico único
function validarCorreoUnico(req, res, next) {
    const correo = req.body.correo;
    const usuarioExistente = usuarios.find(u => u.correo === correo);
    if (usuarioExistente) {
        res.status(400).send('El correo electrónico ya está en uso');
    } else {
        next();
    }
}

// Middleware para validar la contraseña
function validarPassword(req, res, next) {
    const password = req.body.password;

    // Expresión regular para validar la contraseña
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    // Verificar si la contraseña cumple con los requisitos
    if (!regex.test(password)) {
        return res.status(400).send('La contraseña debe contener al menos una letra mayúscula, un carácter especial y tener una longitud mínima de 8 caracteres.');
    }

    next();
}

// Middleware para encriptar la contraseña antes de guardar un usuario
async function encriptarPassword(req, res, next) {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);  // Encriptar la contraseña con bcrypt
    req.body.password = hashedPassword;
    next();
}

// Ruta para obtener la lista de usuarios
app.get('/usuarios', (req, res) => {
    // Filtrar la respuesta para no enviar las contraseñas
    const usuariosSinPassword = usuarios.map(usuario => {
        const { id, nombre, correo } = usuario;
        return { id, nombre, correo };
    });
    res.json(usuariosSinPassword);
});

// Función para generar un token JWT
function generarToken(usuario) {
    // Aquí defines los datos que deseas incluir en el token
    const payload = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
    };

    // Genera y firma el token con una vigencia de 1 hora (3600 segundos)
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Ruta para crear un nuevo usuario (protegida por autenticación de sesión)
app.post('/usuarios',validarCorreoUnico, validarPassword,encriptarPassword, (req, res) => {
    const { nombre, correo, password } = req.body;
    const nuevoUsuario = { id: usuarios.length + 1, nombre, correo, password };
    // Ejemplo de uso: Generar un token para un usuario autenticado
    const tokenGenerado = generarToken(nuevoUsuario);
    console.log('Token generado:', tokenGenerado);

    usuarios.push(nuevoUsuario);
    // Filtrar la respuesta para no enviar la contraseña en la respuesta
    const { id, nombre: nombreUsuario, correo: correoUsuario } = nuevoUsuario;
    res.status(201).json({ id, nombre: nombreUsuario, correo: correoUsuario });
});

// Ruta protegida que usa el middleware de verificación de autenticación de sesión
app.get('/recursos-protegidos', verificarAutenticacion, (req, res) => {
    res.json({ mensaje: 'Acceso concedido. Recursos protegidos.' });
});

// Ruta para actualizar un usuario existente
app.put('/usuarios/:id', verificarAutenticacion, validarPassword, validarPassword, (req, res) => {
    const { id } = req.params;
    const { nombre, correo, password } = req.body;
    const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], nombre, correo, password };
        res.json(usuarios[usuarioIndex]);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// Ruta para eliminar un usuario existente
app.delete('/usuarios/:id', verificarAutenticacion, (req, res) => {
    const { id } = req.params;
    const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
    if (usuarioIndex !== -1) {
        const eliminado = usuarios.splice(usuarioIndex, 1);
        res.json(eliminado);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));


