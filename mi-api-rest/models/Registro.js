/*const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const db = require('./index'); //  la ruta correcta a tu index.js

// Acceder a los modelos desde el objeto db
const { Usuario, Registro } = db; // Destructuración de modelos

Usuario.hasMany(Registro, { foreignKey: 'usuarioId' });
Registro.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Registro;*/

// models/Registro.js (CORREGIDO)

module.exports = (sequelize, DataTypes) => {
    
    // El modelo se llama 'Registro' ( modelo de casos de enfermedad)
    const Registro = sequelize.define('Registro', {
        // Asumo que estos campos son los que realmente quieres para el modelo
        nombre: DataTypes.STRING, 
        enfermedad: DataTypes.STRING,
        latitud: DataTypes.FLOAT,
        longitud: DataTypes.FLOAT,
        apreciaciones: DataTypes.TEXT,
        // Estado del caso (activo/tratado)
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'activo'
        }, 
        fotoURL: DataTypes.STRING,
        // Agrega aquí los campos que faltan...
        usuarioId: { // Clave foránea si la necesitas
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'registros',//tabla en pg
        timestamps: true,
        freezeTableName: true, // forzar la tabla

    });

    // asociacion para que models/index.js lo cargue correctamente
    Registro.associate = function(models) {
        // Un Registro pertenece a un Usuario (es la parte 'belongsTo' de la relación)
        Registro.belongsTo(models.Usuario, { 
            foreignKey: 'usuarioId',
            as: 'usuario' // Alias para cuando haces includes
        });
    };

    return Registro; //  Estructura correcta para el cargador index.js
};