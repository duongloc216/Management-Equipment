const Maintenance = require('../models/Maintenance');

class MaintenanceController {
  static async getAllMaintenance(req, res) {
    try {
      const maintenance = await Maintenance.getAll();
      res.json(maintenance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getMaintenanceById(req, res) {
    try {
      const { id } = req.params;
      const maintenance = await Maintenance.getById(id);
      
      if (!maintenance) {
        return res.status(404).json({ error: 'Maintenance task not found' });
      }
      
      res.json(maintenance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createMaintenance(req, res) {
    try {
      const maintenanceData = req.body;
      const maintenanceId = await Maintenance.create(maintenanceData);
      
      res.status(201).json({ 
        message: 'Maintenance task created successfully',
        maintenanceId 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateMaintenance(req, res) {
    try {
      const { id } = req.params;
      const maintenanceData = req.body;
      
      const maintenance = await Maintenance.getById(id);
      if (!maintenance) {
        return res.status(404).json({ error: 'Maintenance task not found' });
      }
      
      await Maintenance.update(id, maintenanceData);
      
      res.json({ message: 'Maintenance task updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteMaintenance(req, res) {
    try {
      const { id } = req.params;
      
      const maintenance = await Maintenance.getById(id);
      if (!maintenance) {
        return res.status(404).json({ error: 'Maintenance task not found' });
      }
      
      await Maintenance.delete(id);
      
      res.json({ message: 'Maintenance task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getUpcomingMaintenance(req, res) {
    try {
      const maintenance = await Maintenance.getUpcoming();
      res.json(maintenance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getOverdueMaintenance(req, res) {
    try {
      const maintenance = await Maintenance.getOverdue();
      res.json(maintenance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MaintenanceController; 