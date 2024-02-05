import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../database';

export interface PersonAttributes {
  id: number;
  name: string;
  age: number;
}

export interface PersonInstance
  extends Model<PersonAttributes>,
    PersonAttributes {}

const Person = sequelize.define<PersonInstance, PersonAttributes>(
  'Person',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    age: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }
);
export default Person