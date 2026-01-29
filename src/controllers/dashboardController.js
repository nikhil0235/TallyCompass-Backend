const DashboardStats = require('../models/DashboardStats');

// Get the latest dashboard stats
dashboardStatsController = {
  async getDashboardStats(req, res) {
    try {
      const stats = await DashboardStats.findOne().sort({ 'meta.lastUpdated': -1 });
      if (!stats) return res.status(404).json({ message: 'No dashboard stats found' });
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create new dashboard stats
  async createDashboardStats(req, res) {
    try {
      const stats = new DashboardStats(req.body);
      await stats.save();
      res.status(201).json(stats);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update dashboard stats by ID
  async updateDashboardStats(req, res) {
    try {
      const stats = await DashboardStats.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!stats) return res.status(404).json({ message: 'Dashboard stats not found' });
      res.json(stats);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete dashboard stats by ID
  async deleteDashboardStats(req, res) {
    try {
      const stats = await DashboardStats.findByIdAndDelete(req.params.id);
      if (!stats) return res.status(404).json({ message: 'Dashboard stats not found' });
      res.json({ message: 'Dashboard stats deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = dashboardStatsController;
