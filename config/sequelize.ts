import { Sequelize, Options } from 'sequelize';
import { Config } from './config.json';

function createSequelizeInstance(config: Config): Sequelize {
  const sequelizeOptions: Options = {
    host: config.development.host,
    dialect: 'postgres',
    dialectOptions:{
      connectTimeout: 6000000,
    }
  };
  return new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    sequelizeOptions
  );
}

export default createSequelizeInstance;
