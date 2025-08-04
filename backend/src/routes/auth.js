const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Đăng nhập
router.post('/login', AuthController.login);

// Lấy thông tin user
router.get('/user-info', requireAuth, AuthController.getUserInfo);

// Đổi mật khẩu
router.post('/change-password', requireAuth, AuthController.changePassword);

// Quên mật khẩu
router.post('/forgot-password', AuthController.forgotPassword);

module.exports = router; 