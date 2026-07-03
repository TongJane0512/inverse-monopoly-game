import Family from '../models/Family.js';
import User from '../models/User.js';

// Create family profile
export const createFamily = async (req, res) => {
  try {
    const { familyName, members, gameId } = req.body;
    const userId = req.userId;

    // Check if family already exists for this user
    const existingFamily = await Family.findOne({ userId });
    if (existingFamily) {
      return res.status(400).json({ message: 'Family profile already exists for this user' });
    }

    const family = new Family({
      userId,
      familyName,
      members,
      gameId,
      status: 'registered'
    });

    await family.save();

    res.status(201).json({
      message: 'Family profile created successfully',
      family
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get family profile
export const getFamily = async (req, res) => {
  try {
    const userId = req.userId;

    const family = await Family.findOne({ userId })
      .populate('gameId')
      .populate('completedTasks.taskId');

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    res.json(family);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update family profile
export const updateFamily = async (req, res) => {
  try {
    const userId = req.userId;
    const { familyName, members } = req.body;

    const family = await Family.findOneAndUpdate(
      { userId },
      { familyName, members },
      { new: true }
    );

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    res.json({
      message: 'Family profile updated successfully',
      family
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const userId = req.userId;
    const { latitude, longitude } = req.body;

    const family = await Family.findOneAndUpdate(
      { userId },
      {
        currentPosition: {
          latitude,
          longitude,
          timestamp: new Date()
        }
      },
      { new: true }
    );

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    res.json({
      message: 'Location updated',
      family
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get family rankings
export const getFamilyRankings = async (req, res) => {
  try {
    const gameId = req.query.gameId;

    const families = await Family.find({ gameId })
      .populate('userId', 'name')
      .sort({ believeValue: -1 })
      .limit(50);

    const rankings = families.map((family, index) => ({
      rank: index + 1,
      familyName: family.familyName,
      user: family.userId?.name,
      believeValue: family.believeValue,
      propertiesCount: family.properties.length,
      tasksCompleted: family.completedTasks.length
    }));

    res.json(rankings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
