const User = require('../models/User');
const { sendEmail } = require('../config/email');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await User.getByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createUser(req, res) {
    try {
      const userData = req.body;
      
      if (!userData.name || !userData.email || !userData.password || !userData.role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const userId = await User.create(userData);
      
      // Gửi email thông báo tài khoản
      const emailSent = await sendEmail(
        userData.email,
        'Tài khoản của bạn đã được tạo',
        `Xin chào ${userData.name},\n\nTài khoản của bạn đã được tạo thành công.\nEmail: ${userData.email}\nMật khẩu: ${userData.password}\n\nVui lòng đăng nhập và đổi mật khẩu sau khi sử dụng lần đầu.\n\nTrân trọng!`
      );

      if (!emailSent) {
        console.warn('Failed to send welcome email to:', userData.email);
      }
      
      res.status(201).json({ 
        message: 'User created successfully',
        userId 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { email } = req.params;
      const userData = req.body;
      
      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Cập nhật thông tin user (không bao gồm password)
      const { getConnection } = require('../config/database');
      const sql = require('mssql');
      const pool = await getConnection();
      
      await pool.request()
        .input('email', sql.VarChar, email)
        .input('name', sql.VarChar, userData.name)
        .input('role', sql.VarChar, userData.role)
        .input('status', sql.VarChar, userData.status)
        .query(`
          UPDATE Users SET
            name = @name,
            role = @role,
            status = @status
          WHERE email = @email
        `);
      
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { email } = req.params;
      
      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const { getConnection } = require('../config/database');
      const sql = require('mssql');
      const pool = await getConnection();
      
      await pool.request()
        .input('email', sql.VarChar, email)
        .query('DELETE FROM Users WHERE email = @email');
      
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserStats(req, res) {
    try {
      const stats = await User.getStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController; 