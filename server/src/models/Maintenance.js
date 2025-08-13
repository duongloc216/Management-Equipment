const { getConnection } = require('../config/database');
const sql = require('mssql');

class Maintenance {
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT * FROM Maintenance ORDER BY scheduled_date DESC');
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching maintenance tasks: ${err.message}`);
    }
  }

  static async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Maintenance WHERE id = @id');
      return result.recordset[0];
    } catch (err) {
      throw new Error(`Error fetching maintenance task: ${err.message}`);
    }
  }

  static async create(maintenanceData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('equipment', sql.VarChar, maintenanceData.equipment)
        .input('type', sql.VarChar, maintenanceData.type)
        .input('status', sql.VarChar, maintenanceData.status)
        .input('scheduled_date', sql.DateTime, maintenanceData.scheduled_date)
        .input('technician', sql.VarChar, maintenanceData.technician)
        .input('priority', sql.VarChar, maintenanceData.priority)
        .input('estimated_duration', sql.VarChar, maintenanceData.estimated_duration)
        .input('description', sql.Text, maintenanceData.description)
        .query(`
          INSERT INTO Maintenance (equipment, type, status, scheduled_date, technician, priority, estimated_duration, description)
          VALUES (@equipment, @type, @status, @scheduled_date, @technician, @priority, @estimated_duration, @description);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      return result.recordset[0].id;
    } catch (err) {
      throw new Error(`Error creating maintenance task: ${err.message}`);
    }
  }

  static async update(id, maintenanceData) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .input('equipment', sql.VarChar, maintenanceData.equipment)
        .input('type', sql.VarChar, maintenanceData.type)
        .input('status', sql.VarChar, maintenanceData.status)
        .input('scheduled_date', sql.DateTime, maintenanceData.scheduled_date)
        .input('technician', sql.VarChar, maintenanceData.technician)
        .input('priority', sql.VarChar, maintenanceData.priority)
        .input('estimated_duration', sql.VarChar, maintenanceData.estimated_duration)
        .input('description', sql.Text, maintenanceData.description)
        .query(`
          UPDATE Maintenance SET
            equipment = @equipment,
            type = @type,
            status = @status,
            scheduled_date = @scheduled_date,
            technician = @technician,
            priority = @priority,
            estimated_duration = @estimated_duration,
            description = @description
          WHERE id = @id
        `);
      return true;
    } catch (err) {
      throw new Error(`Error updating maintenance task: ${err.message}`);
    }
  }

  static async delete(id) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Maintenance WHERE id = @id');
      return true;
    } catch (err) {
      throw new Error(`Error deleting maintenance task: ${err.message}`);
    }
  }

  static async getUpcoming() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM Maintenance 
        WHERE scheduled_date >= GETDATE() 
        AND status != 'Completed'
        ORDER BY scheduled_date ASC
      `);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching upcoming maintenance: ${err.message}`);
    }
  }

  static async getOverdue() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM Maintenance 
        WHERE scheduled_date < GETDATE() 
        AND status != 'Completed'
        ORDER BY scheduled_date ASC
      `);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching overdue maintenance: ${err.message}`);
    }
  }
}

module.exports = Maintenance; 