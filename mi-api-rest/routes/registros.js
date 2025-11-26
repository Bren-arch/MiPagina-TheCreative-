const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/*router.post('/registro', async (req, res) => {
  try {
    const { nombre, rol, enfermedad, lat, lng, apreciaciones, foto } = req.body;

    // Crear usuario
    const nuevoUsuario = await Usuario.create({ nombre,rol });

    // Crear caso asociado
    const nuevoCaso = await Caso.create({
      enfermedad,
      latitud: lat,
      longitud: lng,
      apreciaciones,
      foto_url: foto,
      usuarioId: nuevoUsuario.id
    });

    res.status(201).json({ usuario: nuevoUsuario, caso: nuevoCaso });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/
//MODELO DE REGISTRO/CASO
const {
  obtenerRegistros,
  crearRegistro,
  eliminarCaso, // (Elimina un CASO)
  marcarComoTratado // ⬅CRÍTICO para la función de administrador
} = require('../controllers/registroController');

// Actualizar el estado de un caso a 'tratado' PUT/registros/:id/tratar
router.put('/:id/tratar', marcarComoTratado);

// Obtener todos los registros GET/registros
router.get('/', obtenerRegistros);

// Crear un nuevo registro con posible foto POST/registros
router.post('/', upload.single('foto'), crearRegistro);

// Eliminar un caso por ID DELETE/registros/id
router.delete('/:id', eliminarCaso);

module.exports = router;