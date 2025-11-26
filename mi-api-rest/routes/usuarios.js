const express = require('express');
const router = express.Router();
const db = require('../models');//ruta dde los moddelos

const {
    // Estas funciones DEBEN usarse aquí, importadas del controlador
    crearUsuario,
    eliminarUsuario 
    // ... y obtenerUsuarios (si la tienes)
} = require('../controllers/registroController'); // o el controlador de usuarios, si lo creaste

// --- RUTAS DE ADMINISTRACIÓN DE USUARIOS (OPERADORES/ADMINS) ---
// Obtener todos los usuarios (GET /usuarios)
router.get('/', async (req, res) => {
  const usuarios = await db.Usuario.findAll();
  res.json(usuarios);
});

// Crea un nuevo usuario (POST /usuarios)
router.post('/', crearUsuario); 

// Elimina un usuario (DELETE /usuarios/:id)
router.delete('/:id', eliminarUsuario);



module.exports = router;

//app.js