const express = require('express');
const router = express.Router();
const RequestController = require('../controllers/requestController');
const { requireAuth } = require('../middleware/auth');

// Lấy tất cả yêu cầu
router.get('/', requireAuth, RequestController.getAllRequests);

// Lấy số lượng yêu cầu tháng này
router.get('/stats/monthly', requireAuth, RequestController.getMonthlyRequestCount);

// Lấy yêu cầu theo ID
router.get('/:id', requireAuth, RequestController.getRequestById);

// Tạo yêu cầu mới
router.post('/', requireAuth, RequestController.createRequest);

// Cập nhật yêu cầu
router.put('/:id', requireAuth, RequestController.updateRequest);

// Xóa yêu cầu
router.delete('/:id', requireAuth, RequestController.deleteRequest);

module.exports = router; 