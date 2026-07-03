import Game from '../models/Game.js';
import Family from '../models/Family.js';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import User from '../models/User.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const { gameId } = req.query;

    const query = gameId ? { gameId } : {};

    const families = await Family.find(query);
    const tasks = await Task.find(query);
    const submissions = await TaskSubmission.find(query);

    const stats = {
      totalFamilies: families.length,
      activeFamilies: families.filter(f => f.status === 'in_progress').length,
      completedFamilies: families.filter(f => f.status === 'completed').length,
      totalTasks: tasks.length,
      activeTasks: tasks.filter(t => t.status === 'active').length,
      totalSubmissions: submissions.length,
      pendingReviews: submissions.filter(s => s.reviewStatus === 'pending').length,
      approvedSubmissions: submissions.filter(s => s.reviewStatus === 'approved').length,
      totalBelieveValue: families.reduce((sum, f) => sum + f.believeValue, 0),
      averageBelieveValue: families.length > 0 
        ? families.reduce((sum, f) => sum + f.believeValue, 0) / families.length 
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all families with details
export const getAllFamiliesDetails = async (req, res) => {
  try {
    const { gameId, page = 1, limit = 10 } = req.query;

    const query = gameId ? { gameId } : {};
    const skip = (page - 1) * limit;

    const families = await Family.find(query)
      .populate('userId', 'name email phone')
      .sort({ believeValue: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Family.countDocuments(query);

    res.json({
      families,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all submissions with filters
export const getAllSubmissions = async (req, res) => {
  try {
    const { gameId, reviewStatus, page = 1, limit = 10 } = req.query;

    const query = {};
    if (gameId) query.gameId = gameId;
    if (reviewStatus) query.reviewStatus = reviewStatus;

    const skip = (page - 1) * limit;

    const submissions = await TaskSubmission.find(query)
      .populate('familyId', 'familyName')
      .populate('taskId', 'title')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TaskSubmission.countDocuments(query);

    res.json({
      submissions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Send notification to families
export const sendNotification = async (req, res) => {
  try {
    const { familyIds, title, message, taskId } = req.body;

    // This would integrate with Socket.io to send real-time notifications
    // For now, we'll just return a success message
    
    res.json({
      message: 'Notification sent successfully',
      sentTo: familyIds.length,
      details: {
        title,
        message,
        taskId,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Export game data
export const exportGameData = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);
    const families = await Family.find({ gameId });
    const tasks = await Task.find({ gameId });
    const submissions = await TaskSubmission.find({ gameId });

    const exportData = {
      game,
      families,
      tasks,
      submissions,
      exportedAt: new Date()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=game-data.json');
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get real-time family locations
export const getFamilyLocations = async (req, res) => {
  try {
    const { gameId } = req.query;

    const families = await Family.find(gameId ? { gameId } : {})
      .select('familyName currentPosition believeValue status');

    const locations = families.map(f => ({
      familyId: f._id,
      familyName: f.familyName,
      latitude: f.currentPosition?.latitude,
      longitude: f.currentPosition?.longitude,
      believeValue: f.believeValue,
      status: f.status
    }));

    res.json(locations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
