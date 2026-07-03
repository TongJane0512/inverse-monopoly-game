import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import Family from '../models/Family.js';

// Create task
export const createTask = async (req, res) => {
  try {
    const {
      gameId,
      title,
      description,
      taskType,
      beliefRequired,
      believeValueReward,
      requiresVideo,
      requiresPhoto,
      requiresAnswer,
      scheduledTime,
      expiresAt
    } = req.body;

    const task = new Task({
      gameId,
      title,
      description,
      taskType,
      beliefRequired,
      believeValueReward,
      requiresVideo,
      requiresPhoto,
      requiresAnswer,
      scheduledTime,
      expiresAt,
      status: 'active'
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign task to families
export const assignTask = async (req, res) => {
  try {
    const { taskId, familyIds } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedFamilies: familyIds },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get tasks for family
export const getTasksForFamily = async (req, res) => {
  try {
    const userId = req.userId;

    const family = await Family.findOne({ userId });
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const tasks = await Task.find({
      gameId: family.gameId,
      assignedFamilies: family._id,
      status: 'active'
    });

    // Get submission status for each task
    const tasksWithStatus = await Promise.all(
      tasks.map(async (task) => {
        const submission = await TaskSubmission.findOne({
          taskId: task._id,
          familyId: family._id
        });
        return {
          ...task.toObject(),
          submissionStatus: submission?.reviewStatus || null,
          submitted: !!submission
        };
      })
    );

    res.json(tasksWithStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Submit task
export const submitTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { taskId, videoUrl, photoUrls, textAnswer } = req.body;

    const family = await Family.findOne({ userId });
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if already submitted
    const existing = await TaskSubmission.findOne({
      taskId,
      familyId: family._id
    });

    if (existing && existing.reviewStatus === 'approved') {
      return res.status(400).json({ message: 'Task already completed' });
    }

    const submission = new TaskSubmission({
      taskId,
      familyId: family._id,
      gameId: family.gameId,
      videoUrl,
      photoUrls,
      textAnswer,
      reviewStatus: 'pending'
    });

    await submission.save();

    res.status(201).json({
      message: 'Task submitted successfully',
      submission
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks (admin)
export const getAllTasks = async (req, res) => {
  try {
    const { gameId } = req.query;

    const tasks = await Task.find(gameId ? { gameId } : {})
      .populate('assignedFamilies', 'familyName');

    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
