const Feature = require('../models/Feature');

// @desc    Add a new feature
// @route   POST /api/feature
// @access  Private
exports.addFeature = async (req, res) => {
  try {
    const feature = await Feature.create(req.body);
    res.status(201).json(feature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all features
// @route   GET /api/feature
// @access  Private
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a feature by ID
// @route   GET /api/feature/:id
// @access  Private
exports.getFeature = async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) return res.status(404).json({ message: 'Feature not found' });
    res.json(feature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a feature
// @route   DELETE /api/feature/:id
// @access  Private
exports.deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) return res.status(404).json({ message: 'Feature not found' });
    res.json({ message: 'Feature deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
