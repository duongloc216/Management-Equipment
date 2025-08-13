const User = require('../models/User');
const { logUserAction } = require('../middleware/auth');
const { sendEmail } = require('../config/email');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Nên đặt ở biến môi trường

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing email or password' 
        });
      }

      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }

      const bcrypt = require('bcryptjs');
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        await logUserAction(email, 'User Login', 'failed');
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }

      await logUserAction(email, 'User Login', 'success');
      await User.updateLastLogin(email);

      // Tạo JWT token
      const token = jwt.sign(
        { email: user.email, name: user.name, role: user.role },
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      res.json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role
        },
        token // Thêm token vào response
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  static async getUserInfo(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ 
          error: 'Missing email' 
        });
      }

      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      res.json({
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (err) {
      res.status(500).json({ 
        error: err.message 
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const email = req.user.email; // Lấy email từ token
      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing data' 
        });
      }
      await User.updatePassword(email, currentPassword, newPassword);
      res.json({ 
        success: true, 
        message: 'Password changed successfully' 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          error: 'Missing email' 
        });
      }

      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          error: 'Email not found' 
        });
      }

      // Tạo mật khẩu mới ngẫu nhiên
      const newPassword = Math.random().toString(36).slice(-8);
      await User.resetPassword(email, newPassword);

      // Gửi email mật khẩu mới
      const emailSent = await sendEmail(
        email,
        'Cấp lại mật khẩu',
        `Mật khẩu mới của bạn là: ${newPassword}\nVui lòng đăng nhập và đổi mật khẩu ngay sau khi sử dụng.`
      );

      if (!emailSent) {
        return res.status(500).json({ 
          error: 'Failed to send email' 
        });
      }

      res.json({ 
        message: 'Mật khẩu mới đã được gửi tới email của bạn.' 
      });
    } catch (err) {
      res.status(500).json({ 
        error: err.message 
      });
    }
  }
}

module.exports = AuthController; 