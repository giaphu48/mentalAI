
const mysql = require('mysql2/promise'); // ✅ Dùng mysql2/promise

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mentalaidb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});// ✅ Trả ra pool promise


// db.connect((err) => {
//   if (err) {
//     console.error('❌ Kết nối MySQL thất bại:', err);
//   } else {
//     console.log('✅ Đã kết nối MySQL thành công');
//   }
// });

module.exports = db;
