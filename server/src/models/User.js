const { getConnection } = require('../config/database');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

class User {
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT email, name, role, status, lastLogin FROM Users');
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching users: ${err.message}`);
    }
  }

  static async getByEmail(email) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
      return result.recordset[0];
    } catch (err) {
      throw new Error(`Error fetching user: ${err.message}`);
    }
  }

  static async create(userData) {
    try {
      const pool = await getConnection();
      
      // Kiểm tra email đã tồn tại
      const existingUser = await pool.request()
        .input('email', sql.VarChar, userData.email)
        .query('SELECT * FROM Users WHERE email = @email');
      
      if (existingUser.recordset.length > 0) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const result = await pool.request()
        .input('email', sql.VarChar, userData.email)
        .input('password', sql.VarChar, hashedPassword)
        .input('name', sql.VarChar, userData.name)
        .input('role', sql.VarChar, userData.role)
        .input('status', sql.VarChar, userData.status || 'active')
        .input('lastLogin', sql.DateTime, userData.lastLogin || null)
        .query(`
          INSERT INTO Users (email, password, name, role, status, lastLogin)
          VALUES (@email, @password, @name, @role, @status, @lastLogin);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      return result.recordset[0].id;
    } catch (err) {
      throw new Error(`Error creating user: ${err.message}`);
    }
  }

  static async updatePassword(email, currentPassword, newPassword) {
    try {
      const pool = await getConnection();
      
      // Lấy thông tin user hiện tại
      const user = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');

      if (user.recordset.length === 0) {
        throw new Error('User not found');
      }

      // Kiểm tra mật khẩu hiện tại
      const isMatch = await bcrypt.compare(currentPassword, user.recordset[0].password);
      if (!isMatch) {
        throw new Error('Incorrect current password');
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu
      await pool.request()
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, hashedPassword)
        .query('UPDATE Users SET password = @password WHERE email = @email');

      return true;
    } catch (err) {
      throw new Error(`Error updating password: ${err.message}`);
    }
  }

  static async resetPassword(email, newPassword) {
    try {
      const pool = await getConnection();
      
      // Kiểm tra user tồn tại
      const user = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');

      if (user.recordset.length === 0) {
        throw new Error('User not found');
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu
      await pool.request()
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, hashedPassword)
        .query('UPDATE Users SET password = @password WHERE email = @email');

      return true;
    } catch (err) {
      throw new Error(`Error resetting password: ${err.message}`);
    }
  }

  static async updateLastLogin(email) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('email', sql.VarChar, email)
        .query('UPDATE Users SET lastLogin = GETDATE() WHERE email = @email');
      return true;
    } catch (err) {
      throw new Error(`Error updating last login: ${err.message}`);
    }
  }

  static async getStats() {
    try {
      const pool = await getConnection();
      const totalUsers = await pool.request().query('SELECT COUNT(*) as total FROM Users');
      const activeUsers = await pool.request().query('SELECT COUNT(DISTINCT assigned_to) as users FROM Devices WHERE assigned_to IS NOT NULL');
      
      return {
        totalUsers: totalUsers.recordset[0].total,
        totalUsersChange: "+3",
        activeSessions: 5,
        activeSessionsChange: "+2",
        systemAlerts: 2,
        systemAlertsChange: "+1"
      };
    } catch (err) {
      throw new Error(`Error fetching user stats: ${err.message}`);
    }
  }
}

module.exports = User; 