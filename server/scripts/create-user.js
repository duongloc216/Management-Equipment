require('dotenv').config();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const { getConnection } = require('../src/config/database');

const newUser = {
  email: 'admin@equipment.com',
  plainPassword: 'admin123',
  name: 'Administrator',
  role: 'admin',
};

async function createUser() {
  try {
    const pool = await getConnection();

    const check = await pool.request()
      .input('email', sql.VarChar, newUser.email)
      .query('SELECT * FROM Users WHERE email = @email');
      
    if (check.recordset.length > 0) {
      console.log('Email đã tồn tại!');
      return;
    }

    const hashedPassword = await bcrypt.hash(newUser.plainPassword, 10);
    await pool.request()
      .input('email', sql.VarChar, newUser.email)
      .input('password', sql.VarChar, hashedPassword)
      .input('name', sql.VarChar, newUser.name)
      .input('role', sql.VarChar, newUser.role)
      .query(`
        INSERT INTO Users (email, password, name, role)
        VALUES (@email, @password, @name, @role)
      `);

    console.log(`User '${newUser.email}' đã được tạo thành công!`);
  } catch (err) {
    console.error('Lỗi khi tạo user:', err.message);
  } finally {
    process.exit(0);
  }
}

createUser(); 