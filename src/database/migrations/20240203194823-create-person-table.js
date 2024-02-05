'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('person', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      age: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('person');
  },
};
