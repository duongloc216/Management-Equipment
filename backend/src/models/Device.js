const { getConnection } = require('../config/database');
const sql = require('mssql');

class Device {
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT * FROM Devices');
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching devices: ${err.message}`);
    }
  }

  static async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Devices WHERE id = @id');
      return result.recordset[0];
    } catch (err) {
      throw new Error(`Error fetching device: ${err.message}`);
    }
  }

  static async create(deviceData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('name', sql.VarChar, deviceData.name)
        .input('status', sql.VarChar, deviceData.status)
        .input('department', sql.VarChar, deviceData.department)
        .input('assigned_to', sql.VarChar, deviceData.assigned_to)
        .input('purchase_date', sql.Date, deviceData.purchase_date)
        .input('maintenance_due', sql.Date, deviceData.maintenance_due)
        .query(`
          INSERT INTO Devices (name, status, department, assigned_to, purchase_date, maintenance_due)
          VALUES (@name, @status, @department, @assigned_to, @purchase_date, @maintenance_due);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      return result.recordset[0].id;
    } catch (err) {
      throw new Error(`Error creating device: ${err.message}`);
    }
  }

  static async update(id, deviceData) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, deviceData.name)
        .input('status', sql.VarChar, deviceData.status)
        .input('department', sql.VarChar, deviceData.department)
        .input('assigned_to', sql.VarChar, deviceData.assigned_to)
        .input('purchase_date', sql.Date, deviceData.purchase_date)
        .input('maintenance_due', sql.Date, deviceData.maintenance_due)
        .query(`
          UPDATE Devices SET
            name = @name,
            status = @status,
            department = @department,
            assigned_to = @assigned_to,
            purchase_date = @purchase_date,
            maintenance_due = @maintenance_due
          WHERE id = @id
        `);
      return true;
    } catch (err) {
      throw new Error(`Error updating device: ${err.message}`);
    }
  }

  static async delete(id) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Devices WHERE id = @id');
      return true;
    } catch (err) {
      throw new Error(`Error deleting device: ${err.message}`);
    }
  }

  static async getStats() {
    try {
      const pool = await getConnection();
      const total = await pool.request().query('SELECT COUNT(*) as total FROM Devices');
      const available = await pool.request().query("SELECT COUNT(*) as available FROM Devices WHERE status = 'Available'");
      const inUse = await pool.request().query("SELECT COUNT(*) as in_use FROM Devices WHERE status = 'In Use'");
      const maintenance = await pool.request().query("SELECT COUNT(*) as maintenance_due FROM Devices WHERE status = 'Maintenance Due'");

      return {
        totalEquipment: total.recordset[0].total,
        
        availableEquipment: available.recordset[0].available,
        
        inUseEquipment: inUse.recordset[0].in_use,
        
        maintenanceDue: maintenance.recordset[0].maintenance_due,
        
      };
    } catch (err) {
      throw new Error(`Error fetching device stats: ${err.message}`);
    }
  }

  static async getStatsByDepartment() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT
          department,
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available,
          SUM(CASE WHEN status = 'In Use' THEN 1 ELSE 0 END) AS inUse,
          SUM(CASE WHEN status = 'Maintenance Due' THEN 1 ELSE 0 END) AS maintenanceDue
        FROM Devices
        GROUP BY department
      `);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching department stats: ${err.message}`);
    }
  }
}

module.exports = Device; 