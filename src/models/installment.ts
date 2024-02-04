import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export interface InstallmentAttributes {
  id: number;
  transactionId: number;
  installmentNumber: number;
  value: number;
}

export interface InstallmentInstance
  extends Model<InstallmentAttributes>,
    InstallmentAttributes {}

const Installment = sequelize.define<
  InstallmentInstance,
  InstallmentAttributes
>('Installment', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  transactionId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
    references: { model: 'Transaction', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  installmentNumber: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  value: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

export default Installment;
