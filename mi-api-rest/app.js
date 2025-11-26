const express = require('express');
const cors = require('cors'); // Necesario para la comunicación Front-end
const morgan = require('morgan');
//const sequelize = require('./config');

// Importar rutas dedicadas para Registros/Casos
const registrosRoutes = require('./routes/registros'); 
// Importar NUEVAS rutas dedicadas para Usuarios (operadores/admins)
const usuariosRoutes = require('./routes/usuarios');

const db = require('./models');

const app = express();
//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// Servir archivos estáticos (fotos de casos)
app.use('/uploads', express.static('uploads'));
//Definición de Endpoints ---
// RUTAS DE CASOS: Se accede a ellas con /registros
app.use('/registros', registrosRoutes);

// RUTAS DE USUARIOS: Se accede a ellas con /usuarios (para la administración)
app.use('/usuarios', usuariosRoutes);


/*Rutas
app.post('/usuarios', async (req, res) => {
  const usuario = await db.Usuario.create(req.body);
  res.status(201).json(usuario);
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await db.Usuario.findAll();
  res.json(usuarios);
});
*/

// Conectar a la base de datos y arrancar el servidor
db.sequelize.sync({ alter : true }) //alter/true para actualiar sin borrar datos
.then(() => {
  console.log('conexion a la base de datos exitosa')
  app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
  });
});
