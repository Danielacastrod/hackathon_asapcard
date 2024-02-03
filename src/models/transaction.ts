import { DataTypes, Model, type Optional } from 'sequelize'
const sequelize: Sequelize = require('../config/sequelize');

export interface TransactionAttributes {
  id: number;
  personid: number;
  InstallmentDate: Date;
  amount: number;
}

export interface TransactionInstance
  extends Model<TransactionAttributes>,
    TransactionAttributes {}

const Transaction = sequelize.define<
  TransactionInstance,
  TransactionAttributes
>('Transaction', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  personid: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
    references: { model: 'Installment', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  InstallmentDate: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  amount: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

export default Transaction