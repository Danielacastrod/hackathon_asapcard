const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importe o arquivo de configuração do Sequelize

const Installment = sequelize.define('Installment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  installmentNumber: {
    type: DataTypes.INTEGER,
  },
  value: {
    type: DataTypes.FLOAT,
  },
});

module.exports = Installment;
