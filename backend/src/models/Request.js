const { getConnection } = require('../config/database');
const sql = require('mssql');

class Request {
  static async getAll(limit = null) {
    try {
      const pool = await getConnection();
      let query = 'SELECT * FROM Requests ORDER BY created_date DESC';
      if (limit) {
        query += ` OFFSET 0 ROWS FETCH NEXT ${parseInt(limit)} ROWS ONLY`;
      }
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching requests: ${err.message}`);
    }
  }

  static async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Requests WHERE id = @id');
      return result.recordset[0];
    } catch (err) {
      throw new Error(`Error fetching request: ${err.message}`);
    }
  }

  static async create(requestData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('title', sql.VarChar, requestData.title)
        .input('status', sql.VarChar, requestData.status)
        .input('requested_by', sql.VarChar, requestData.requested_by)
        .input('department', sql.VarChar, requestData.department)
        .input('urgency', sql.VarChar, requestData.urgency)
        .input('created_date', sql.DateTime, requestData.created_date)
        .query(`
          INSERT INTO Requests (title, status, requested_by, department, urgency, created_date)
          VALUES (@title, @status, @requested_by, @department, @urgency, @created_date);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      return result.recordset[0].id;
    } catch (err) {
      throw new Error(`Error creating request: ${err.message}`);
    }
  }

  static async update(id, requestData) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.VarChar, requestData.title)
        .input('status', sql.VarChar, requestData.status)
        .input('requested_by', sql.VarChar, requestData.requested_by)
        .input('department', sql.VarChar, requestData.department)
        .input('urgency', sql.VarChar, requestData.urgency)
        .input('created_date', sql.DateTime, requestData.created_date)
        .query(`
          UPDATE Requests SET
            title = @title,
            status = @status,
            requested_by = @requested_by,
            department = @department,
            urgency = @urgency,
            created_date = @created_date
          WHERE id = @id
        `);
      return true;
    } catch (err) {
      throw new Error(`Error updating request: ${err.message}`);
    }
  }

  static async delete(id) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Requests WHERE id = @id');
      return true;
    } catch (err) {
      throw new Error(`Error deleting request: ${err.message}`);
    }
  }

  static async getMonthlyCount() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT COUNT(*) as requests 
        FROM Requests 
        WHERE MONTH(created_date) = MONTH(GETDATE()) 
        AND YEAR(created_date) = YEAR(GETDATE())
      `);
      return result.recordset[0].requests;
    } catch (err) {
      throw new Error(`Error fetching monthly request count: ${err.message}`);
    }
  }

  static async getByUserEmail(email) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Requests WHERE requested_by = @email ORDER BY created_date DESC');
      return result.recordset;
    } catch (err) {
      throw new Error(`Error fetching user requests: ${err.message}`);
    }
  }
}

module.exports = Request; 