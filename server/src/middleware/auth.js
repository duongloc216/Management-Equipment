const bcrypt = require('bcryptjs');
const sql = require('mssql');
const { getConnection } = require('../config/database');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

const authenticateUser = async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing email or password' 
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logUserAction(email, 'User Login', 'failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    await logUserAction(email, 'User Login', 'success');
    await updateLastLogin(email);

    req.user = {
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required' 
    });
  }
  next();
};

const logUserAction = async (email, action, status) => {
  try {
    const pool = await getConnection();
    await pool.request()
      .input('action', sql.VarChar, action)
      .input('user', sql.VarChar, email)
      .input('status', sql.VarChar, status)
      .query('INSERT INTO Logs (action, [user], status) VALUES (@action, @user, @status)');
  } catch (err) {
    console.error('Logging error:', err);
  }
};

const updateLastLogin = async (email) => {
  try {
    const pool = await getConnection();
    await pool.request()
      .input('email', sql.VarChar, email)
      .query('UPDATE Users SET lastLogin = GETDATE() WHERE email = @email');
  } catch (err) {
    console.error('Update last login error:', err);
  }
};

module.exports = {
  authenticateUser,
  requireAuth,
  requireAdmin,
  logUserAction
}; 