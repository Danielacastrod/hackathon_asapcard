const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importe o arquivo de configuração do Sequelize

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionDate: {
    type: DataTypes.DATE,
  },
  amount: {
    type: DataTypes.FLOAT,
  },
  numInstallments: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Transaction;
