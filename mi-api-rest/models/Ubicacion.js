/*const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Ubicacion = sequelize.define('Ubicacion', {
  latitud: DataTypes.FLOAT,
  longitud: DataTypes.FLOAT,
  descripcion: DataTypes.STRING,
  foto: DataTypes.STRING,
  plaga: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  inspeccionado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'ubicaciones',
  timestamps: true,
});

module.exports = Ubicacion;

//modelo*/
// models/Ubicacion.js (CORREGIDO)

module.exports = (sequelize, DataTypes) => {

    const Ubicacion = sequelize.define('Ubicacion', {
        latitud: DataTypes.FLOAT,
        longitud: DataTypes.FLOAT,
        descripcion: DataTypes.STRING,
        foto: DataTypes.STRING,
        plaga: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        inspeccionado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'ubicaciones',
        timestamps: true,
    });

    return Ubicacion; // Estructura correcta para el cargador index.js
};