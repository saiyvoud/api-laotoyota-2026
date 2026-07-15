import mysql from "mysql2";
// const connected = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "db_laotoyota"
// });

const connected = mysql.createConnection({
  
  host: "178.128.61.88",
  port: 3306,
  user: "root",
  password: "Laotoyota@2o26_",
  database: "db_laotoyota"
});

connected.connect((err) => {
  if (err) {
    console.error('❌ Failed Connect Database:', err.message);
  } else {
    console.log('✅ Connected Database!');
  }
});
export default connected;