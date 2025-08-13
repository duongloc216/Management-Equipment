const express = require('express');
const router = express.Router();

// Import các routes
const authRoutes = require('./auth');
const deviceRoutes = require('./devices');
const requestRoutes = require('./requests');
const maintenanceRoutes = require('./maintenance');
const userRoutes = require('./users');
const reportRoutes = require('./reports');

// Sử dụng các routes
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/requests', requestRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

// Test route
router.get('/test', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    const pool = await getConnection();
    res.json({ message: 'Kết nối SQL Server thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 