const sequelizeConfig = {
  development: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  test: {
    dialect: process.env.DB_TEST_DIALECT,
    host: process.env.DB_TEST_HOST,
    port: process.env.DB_TEST_PORT,
    database: process.env.DB_TEST_DATABASE,
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
  },
  production: {
    dialect: process.env.DB_PROD_DIALECT,
    host: process.env.DB_PROD_HOST,
    port: process.env.DB_PROD_PORT,
    database: process.env.DB_PROD_DATABASE,
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_PASSWORD,
  },
};

module.exports = sequelizeConfig;
  