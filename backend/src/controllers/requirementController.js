import Requirement from '../models/Requirement.js';

export const createRequirement = async (req, res) => {
  try {
    const requirement = new Requirement(req.body); // includes price
    await requirement.save();
    res.status(201).json(requirement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRequirements = async (req, res) => {
  try {
    const { factoryId } = req.query;
    let query = {};
    if (factoryId) {
      query.factoryId = factoryId;
    }
    const requirements = await Requirement.find(query);
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // may include price
    const requirement = await Requirement.findByIdAndUpdate(id, updates, { new: true });
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    res.json(requirement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const requirement = await Requirement.findByIdAndDelete(id);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    res.json({ message: 'Requirement deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
