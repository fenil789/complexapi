const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "crud",
  port: 3306,
  password: "",
});

module.exports = connection;
