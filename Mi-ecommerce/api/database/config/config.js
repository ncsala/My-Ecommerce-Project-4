require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER, //|| 'root',
    password: process.env.DB_PASS, //|| null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST, //|| '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  }, 
  test: {
    username: process.env.DB_USER, //|| 'root',
    password: process.env.DB_PASS, //|| null,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST, //|| '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
};

module.exports = config;
