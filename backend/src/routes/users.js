const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Lấy tất cả người dùng (chỉ admin)
router.get('/', requireAuth, requireAdmin, UserController.getAllUsers);

// Lấy thống kê người dùng
router.get('/stats/overview', requireAuth, requireAdmin, UserController.getUserStats);

// Lấy thông tin người dùng theo email
router.get('/:email', requireAuth, UserController.getUserByEmail);

// Tạo người dùng mới (chỉ admin)
router.post('/', requireAuth, requireAdmin, UserController.createUser);

// Cập nhật người dùng (chỉ admin)
router.put('/:email', requireAuth, requireAdmin, UserController.updateUser);

// Xóa người dùng (chỉ admin)
router.delete('/:email', requireAuth, requireAdmin, UserController.deleteUser);

module.exports = router; 