const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// 🧪 Ruta de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { username, password } });

    if (!usuario) {
      return res.status(401).send('Usuario o contraseña incorrectos ❌');
    }

    // Redirección según el rol
    if (usuario.rol === 'admin') {
      res.redirect('/admin.html');
    } else {
      res.redirect('/usuario.html');
    }
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al procesar el login' });
  }
});

// 🆕 Crear usuario
router.post('/registro', async (req, res) => {
  const { username, password, rol } = req.body;

  try {
    const nuevoUsuario = await Usuario.create({ username, password, rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
});

// 📋 Ver todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;