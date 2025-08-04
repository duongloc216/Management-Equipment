const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const { requireAuth } = require('../middleware/auth');

// Lấy tất cả thiết bị
router.get('/', requireAuth, DeviceController.getAllDevices);

// Lấy thống kê thiết bị
router.get('/stats/overview', requireAuth, DeviceController.getDeviceStats);

// Lấy thống kê theo phòng ban
router.get('/stats/department', requireAuth, DeviceController.getDepartmentStats);

// Lấy thiết bị theo ID
router.get('/:id', requireAuth, DeviceController.getDeviceById);

// Tạo thiết bị mới
router.post('/', requireAuth, DeviceController.createDevice);

// Cập nhật thiết bị
router.put('/:id', requireAuth, DeviceController.updateDevice);

// Xóa thiết bị
router.delete('/:id', requireAuth, DeviceController.deleteDevice);

module.exports = router; 