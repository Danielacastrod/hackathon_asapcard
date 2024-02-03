const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importe o arquivo de configuração do Sequelize

const Person = sequelize.define('Person', {
  document: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Person;
