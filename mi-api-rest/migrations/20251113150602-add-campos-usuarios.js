'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'enfermedad', {
      type: Sequelize.STRING,
      allowNull: true,//false,por ahora
      defaultValue: false,
    });
    await queryInterface.addColumn('Usuarios', 'lat', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
    await queryInterface.addColumn('Usuarios', 'lng', {
      type: Sequelize.FLOAT,
      allowNull: true//false
    });
    await queryInterface.addColumn('Usuarios', 'apreciaciones', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.addColumn('Usuarios', 'rol', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Usuarios', 'foto', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'enfermedad');
    await queryInterface.removeColumn('Usuarios', 'lat');
    await queryInterface.removeColumn('Usuarios', 'lng');
    await queryInterface.removeColumn('Usuarios', 'apreciaciones');
    await queryInterface.removeColumn('Usuarios', 'rol');
    await queryInterface.removeColumn('Usuarios', 'foto');
  }
};