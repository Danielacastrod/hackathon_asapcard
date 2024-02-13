import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../database';
const { UUID, UUIDV4, INTEGER, FLOAT } = DataTypes;

export interface InstallmentAttributes {
  id: any;
  transactionId: string;
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
    type: DataTypes.INTEGER,
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

export default Installment