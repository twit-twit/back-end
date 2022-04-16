require('dotenv').config();
const env = process.env;

const development = {
  username: env.MYSQL_ID,
  //env.MYSQL_USERNAME은 불러오고자 하는 데이터의 키값이므로 자유롭게 이름설정이 가능하다.
  password: env.MYSQL_PW,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};

const production = {
  username: env.MYSQL_ID,
  password: env.MYSQL_PW,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};

const test = {
  username: env.MYSQL_ID,
  password: env.MYSQL_PW,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};

module.exports = { development, production, test };