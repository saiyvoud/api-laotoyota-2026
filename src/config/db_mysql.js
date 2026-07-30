// import mysql from "mysql2";
// const connected = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "db_laotoyota"
// });

// const connected = mysql.createConnection({
// const connected = mysql.createPool({

//   host: "178.128.61.88",
//   port: 3306,
//   user: "root",
//   password: "Laotoyota@2o26_",
//   database: "db_laotoyota"
// });

// connected.connect((err) => {
// connected.getConnection((err) => {
//   if (err) {
//     console.error('❌ Failed Connect Database:', err.message);
//   } else {
//     console.log('✅ Connected Database!');
//     connection.release();
//   }
// });
// export default connected;



import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '178.128.61.88',
  port: 3306,
  user: 'root',
  password: 'Laotoyota@2o26_',
  database: 'db_laotoyota',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000, // 60 ວິນາທີ
  enableKeepAlive: true, // 🟢 ສົ່ງ Signal ໄປຫາ MySQL ເພື່ອບໍ່ໃຫ້ Connection ຫຼຸດ
  keepAliveInitialDelay: 0
});

try {
  const connection = await pool.getConnection();
  console.log('✅ Connected Database!');
  connection.release();
} catch (err) {
  console.error('❌ Failed Connect Database:', err.message);
}


export default pool;