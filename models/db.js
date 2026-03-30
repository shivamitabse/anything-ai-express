import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "shivakumar",
  database: "mydb",
  port: 3306,
});

export default pool;
