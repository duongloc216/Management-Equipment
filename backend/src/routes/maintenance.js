const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const { requireAuth } = require('../middleware/auth');

// Lấy tất cả bảo trì
router.get('/', requireAuth, MaintenanceController.getAllMaintenance);

// Lấy bảo trì sắp tới
router.get('/upcoming/list', requireAuth, MaintenanceController.getUpcomingMaintenance);

// Lấy bảo trì quá hạn
router.get('/overdue/list', requireAuth, MaintenanceController.getOverdueMaintenance);

// Lấy bảo trì theo ID
router.get('/:id', requireAuth, MaintenanceController.getMaintenanceById);

// Tạo bảo trì mới
router.post('/', requireAuth, MaintenanceController.createMaintenance);

// Cập nhật bảo trì
router.put('/:id', requireAuth, MaintenanceController.updateMaintenance);

// Xóa bảo trì
router.delete('/:id', requireAuth, MaintenanceController.deleteMaintenance);

module.exports = router; 