//const { DataTypes } = require('sequelize');
//const sequelize = require('../config'); //ajusta la ruta
//const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Usuario sin nombre',
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    // Establece un valor por defecto para las filas antiguas
    defaultValue: 'user',
    validate: {
                isIn: {
                    args: [['admin', 'user', 'operador', 'administrador']],
                    msg: 'El campo rol debe ser uno de los valores definidos' // Mensaje de error personalizado
                }
            }
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'sin.email@ejemplo.com',
    validate: {
      isEmail: true
  },
}}, {
        // forzar el nombre de la tabla
        tableName: 'usuarios', 
        freezeTableName: true, // Asegura que no intente pluralizar
        
 //Sequelize añade automáticamente createdAt y updatedAt
});

// MÉTODO DE ASOCIACIÓN: CRÍTICO para resolver el error en models/index.js
    Usuario.associate = function(models) {
        // Un Usuario puede tener muchos Registros (casos de enfermedad)
        Usuario.hasMany(models.Registro, { 
            foreignKey: 'usuarioId',
            as: 'registros' // Alias para las consultas
        });
    };

    return Usuario; // La función debe devolver el modelo definido
};
