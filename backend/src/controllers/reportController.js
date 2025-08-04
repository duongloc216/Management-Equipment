const Device = require('../models/Device');
const User = require('../models/User');
const Request = require('../models/Request');
const Maintenance = require('../models/Maintenance');
const { getConnection } = require('../config/database');
const ExcelJS = require('exceljs');
const sql = require('mssql');

class ReportController {
  static async getOverview(req, res) {
    try {
      const deviceStats = await Device.getStats();
      const userStats = await User.getStats();
      const monthlyRequests = await Request.getMonthlyCount();
      
      // Giả lập costSavings, bạn có thể tính toán thực tế nếu có dữ liệu
      const costSavings = 15200;

      res.json({
        equipmentUtilization: 78, // hoặc tính toán thực tế
        activeUsers: userStats.activeSessions,
        monthlyRequests: monthlyRequests,
        costSavings: costSavings
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUserOverview(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Lấy thông tin user
      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Lấy thống kê thiết bị theo department
      const deviceStats = await Device.getStatsByDepartment();
      
      // Vì Users table không có department field, sử dụng department đầu tiên hoặc 'General'
      const userDepartment = 'General';
      const userDeptStats = deviceStats.find(stat => 
        stat.department.toLowerCase() === userDepartment.toLowerCase()
      ) || deviceStats[0];

      // Lấy số lượng requests của user
      const userRequests = await Request.getByUserEmail(email);
      const monthlyRequests = userRequests.length;

      // Tính utilization dựa trên department
      const utilization = userDeptStats ? 
        Math.round(((userDeptStats.inUse + userDeptStats.available) / userDeptStats.total) * 100) : 0;

      res.json({
        equipmentUtilization: utilization,
        activeUsers: 1, // Chỉ tính user hiện tại
        monthlyRequests: monthlyRequests,
        userDepartment: userDepartment,
        departmentStats: userDeptStats,
        userRequests: userRequests.length
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async exportReport(req, res) {
    const { type } = req.query;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      if (type === 'Equipment Inventory Report') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Name', key: 'name', width: 30 },
          { header: 'Type', key: 'type', width: 20 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Assigned To', key: 'assigned_to', width: 20 },
          { header: 'Purchase Date', key: 'purchase_date', width: 15 },
          { header: 'Maintenance Due', key: 'maintenance_due', width: 15 },
        ];
        const devices = await Device.getAll();
        worksheet.addRows(devices);
      }

      else if (type === 'Utilization Analytics') {
        worksheet.columns = [
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Total', key: 'total', width: 10 },
          { header: 'In Use', key: 'inUse', width: 10 },
          { header: 'Available', key: 'available', width: 10 },
          { header: 'Maintenance Due', key: 'maintenanceDue', width: 15 },
        ];
        const stats = await Device.getStatsByDepartment();
        worksheet.addRows(stats);
      }

      else if (type === 'Maintenance Schedule') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Equipment', key: 'equipment', width: 30 },
          { header: 'Type', key: 'type', width: 20 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Scheduled Date', key: 'scheduled_date', width: 15 },
          { header: 'Technician', key: 'technician', width: 20 },
          { header: 'Priority', key: 'priority', width: 10 },
          { header: 'Duration', key: 'estimated_duration', width: 15 },
          { header: 'Description', key: 'description', width: 30 },
        ];
        const maintenance = await Maintenance.getAll();
        worksheet.addRows(maintenance);
      }

      else {
        return res.status(400).json({ error: 'Invalid report type' });
      }

      // Trả về file Excel
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${type.replace(/\s+/g, '_')}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();

    } catch (err) {
      console.error('Export error:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async exportUserReport(req, res) {
    const { type, email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('User Report');

      if (type === 'My Requests') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Title', key: 'title', width: 40 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Urgency', key: 'urgency', width: 15 },
          { header: 'Created Date', key: 'created_date', width: 20 },
        ];
        const userRequests = await Request.getByUserEmail(email);
        worksheet.addRows(userRequests);
      }

      else if (type === 'My Department') {
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Name', key: 'name', width: 30 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Assigned To', key: 'assigned_to', width: 20 },
          { header: 'Purchase Date', key: 'purchase_date', width: 15 },
          { header: 'Maintenance Due', key: 'maintenance_due', width: 15 },
        ];
        // Lấy thiết bị theo department của user (sử dụng 'General' vì không có department field)
        const devices = await Device.getAll();
        const userDevices = devices.filter(device => device.department === 'General');
        worksheet.addRows(userDevices);
      }

      else if (type === 'My Activity') {
        worksheet.columns = [
          { header: 'Action', key: 'action', width: 30 },
          { header: 'User', key: 'user', width: 30 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Time', key: 'time', width: 20 },
        ];
        // Lấy logs của user
        const pool = await getConnection();
        const result = await pool.request()
          .input('email', sql.VarChar, email)
          .query('SELECT action, [user], status, time FROM Logs WHERE [user] = @email ORDER BY time DESC');
        worksheet.addRows(result.recordset);
      }

      else {
        return res.status(400).json({ error: 'Invalid report type' });
      }

      // Trả về file Excel
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${type.replace(/\s+/g, '_')}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();

    } catch (err) {
      console.error('Export user report error:', err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getLogs(req, res) {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT * FROM Logs ORDER BY time DESC');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ReportController; 