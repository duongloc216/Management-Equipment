const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Lấy tổng quan báo cáo (chỉ admin)
router.get('/overview', requireAuth, requireAdmin, ReportController.getOverview);

// Lấy tổng quan báo cáo cho user thường
router.get('/user-overview', requireAuth, ReportController.getUserOverview);

// Xuất báo cáo Excel (chỉ admin)
router.get('/export', requireAuth, requireAdmin, ReportController.exportReport);

// Xuất báo cáo Excel cho user thường
router.get('/export-user', requireAuth, ReportController.exportUserReport);

// Lấy logs hệ thống (chỉ admin)
router.get('/logs', requireAuth, requireAdmin, ReportController.getLogs);

module.exports = router; 