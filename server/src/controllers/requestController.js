const Request = require('../models/Request');

class RequestController {
  static async getAllRequests(req, res) {
    try {
      const { limit } = req.query;
      const requests = await Request.getAll(limit);
      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getRequestById(req, res) {
    try {
      const { id } = req.params;
      const request = await Request.getById(id);
      
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      res.json(request);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createRequest(req, res) {
    try {
      const requestData = req.body;
      const requestId = await Request.create(requestData);
      
      res.status(201).json({ 
        message: 'Request created successfully',
        requestId 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateRequest(req, res) {
    try {
      const { id } = req.params;
      const requestData = req.body;
      
      const request = await Request.getById(id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      await Request.update(id, requestData);
      
      res.json({ message: 'Request updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteRequest(req, res) {
    try {
      const { id } = req.params;
      
      const request = await Request.getById(id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      await Request.delete(id);
      
      res.json({ message: 'Request deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getMonthlyRequestCount(req, res) {
    try {
      const count = await Request.getMonthlyCount();
      res.json({ monthlyRequests: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RequestController; 