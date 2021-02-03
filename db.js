const mysql=require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'12345678',
    database: 'mybike',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  module.exports=pool;