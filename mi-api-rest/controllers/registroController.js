/*const Registro  = require('../models/Registro');
const Usuario = require('../models/Usuario');

const obtenerRegistros = async (req, res) => {
  const { enfermedad } = req.query;
  const registros = enfermedad
    ? await Registro.findAll({ where: { enfermedad } })
    : await Registro.findAll();
  res.json(registros);
};
*/
const db = require('../models'); 
const Registro = db.Registro; 
const Usuario = db.Usuario;


//  Agregado try...catch para manejar errores de DB/Sequelize.
const obtenerRegistros = async (req, res) => {
    // frontend maneja el filtrado de todos los resultados.
    try {
        const registros = await Registro.findAll({
            // Opcional: Si quieres ordenar por fecha de creación (más reciente primero)
            order: [['createdAt', 'DESC']]
        });
        
        // CRÍTICO: Registra la cantidad de datos en la consola del servidor
        console.log(`[Backend Log] Se encontraron ${registros.length} registros.`);
        //se espera un array JSON
        res.status(200).json(registros);
        
    } catch (error) {
        console.error("Error al obtener registros:", error);
        res.status(500).json({ 
            mensaje: "Error interno del servidor al obtener registros.", 
            error: error.message 
        });
    }
};


const crearRegistro = async (req, res) => {
  let { nombre, enfermedad, lat, lng, apreciaciones, fecha, rol, email, estado } = req.body;//usuarioId agregado al destructuring
  
  if (lat == null || lng == null) {
    return res.status(400).json({ error: "Latitud y longitud son obligatorias." });
}
  // Si usas Multer, esta línea está bien:
  const fotoURL = req.file ? `/uploads/${req.file.filename}` : null;
  
  console.log(req.body)
  
  //// 3. Usa .trim() para eliminar cualquier espacio en blanco invisible.
  nombre = Array.isArray(nombre) ? nombre[0].trim() : String(nombre).trim();
  email = Array.isArray(email) ? email[0].trim() : String(email).trim();

  try {
    // 1. Buscar o Crear el Usuario por Email
        const [usuario] = await Usuario.findOrCreate({
            where: { email: email },
            defaults: { nombre: nombre, rol: rol || 'operador' } // Usar 'operador' si no viene rol
        });

        // 2. crea el nuevo resgistro/caso relacionado al usuario id
        const nuevoRegistro = await Registro.create({
            nombre, 
            enfermedad, 
            latitud: lat, 
            longitud: lng, 
            apreciaciones, 
            fecha, 
            rol, 
            fotoURL,
            estado: estado || 'activo',
            // Asocia el caso al ID del usuario recién encontrado/creado
            usuarioId: usuario.id
        });
        res.status(201).json(nuevoRegistro);
    } catch (error) {
        console.error("Error al crear registro:", error);
        // Si hay error en la base de datos (ej. campo faltante, clave foránea), lo notifica.
        res.status(500).json({ 
            mensaje: "Error interno del servidor al crear el registro.", 
            error: error.message 
        });
    }
};

// CORREGIDA: Elimina un CASO de la tabla 'Registro'
const eliminarCaso = async (req, res) => {
    try {
        const id = req.params.id;
        // Usa Registro.destroy para eliminar el caso
        const resultado = await Registro.destroy({
            where: { id: id }
        });

        if (resultado === 0) {
            return res.status(404).json({ error: 'Registro de caso no encontrado' });
        }
        res.status(204).send(); // 204 No Content para éxito en DELETE
        
    } catch (error) {
        console.error('Error al eliminar registro de caso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const crearUsuario = async (req, res) => {
    const { email, nombre, rol } = req.body; // Asume que el admin envía estos datos
    try {
        if (!email || !rol) {
            return res.status(400).json({ error: 'Email y Rol son obligatorios.' });
        }
        
        const nuevoUsuario = await Usuario.create({ email, nombre, rol });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(409).json({ error: 'El email ya está registrado.' });
        }
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// **NUEVO:** Función para eliminar un USUARIO de la tabla 'Usuario'
const eliminarUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Usa Usuario.destroy para eliminar la cuenta de operador/admin
        const resultado = await Usuario.destroy({
            where: { id: id }
        });

        if (resultado === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        // NOTA: Debes manejar el error de clave foránea si el usuario tiene casos asociados.
        res.status(500).json({ error: 'Error interno del servidor. (Puede tener casos asociados)' });
    }
};

// NUEVA FUNCIÓN: Marcar un caso como tratado (requerida por el frontend)
const marcarComoTratado = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Asume que tu modelo Registro tiene una columna 'estado' con valor por defecto 'activo'
        const [filasActualizadas] = await Registro.update({ estado: 'tratado' }, {
            where: { id: id }
        });

        if (filasActualizadas === 0) {
            return res.status(404).json({ error: 'Registro de caso no encontrado' });
        }

        // 200 OK y devuelve el ID para confirmación
        res.status(200).json({ mensaje: `Caso ${id} marcado como tratado` }); 
        
    } catch (error) {
        console.error('Error al marcar caso como tratado:', error);
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al actualizar el estado.',
            error: error.message 
        });
    }
};

module.exports = { 
    eliminarCaso, 
    obtenerRegistros, 
    crearRegistro, 
    crearUsuario, 
    eliminarUsuario,
    marcarComoTratado 
};