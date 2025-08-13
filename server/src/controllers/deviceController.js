const Device = require('../models/Device');
const { logUserAction } = require('../middleware/auth');

class DeviceController {
  static async getAllDevices(req, res) {
    try {
      const devices = await Device.getAll();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getDeviceById(req, res) {
    try {
      const { id } = req.params;
      const device = await Device.getById(id);
      
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      res.json(device);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createDevice(req, res) {
    try {
      const deviceData = req.body;
      const { userEmail } = deviceData;
      
      const deviceId = await Device.create(deviceData);
      
      if (userEmail) {
        await logUserAction(userEmail, 'Device Added', 'success');
      }
      
      res.status(201).json({ 
        message: 'Device added successfully',
        deviceId 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateDevice(req, res) {
    try {
      const { id } = req.params;
      const deviceData = req.body;
      
      const device = await Device.getById(id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      await Device.update(id, deviceData);
      
      res.json({ message: 'Device updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteDevice(req, res) {
    try {
      const { id } = req.params;
      
      const device = await Device.getById(id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      
      await Device.delete(id);
      
      res.json({ message: 'Device deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getDeviceStats(req, res) {
    try {
      const stats = await Device.getStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getDepartmentStats(req, res) {
    try {
      const stats = await Device.getStatsByDepartment();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = DeviceController; 