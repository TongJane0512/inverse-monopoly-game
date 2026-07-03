import TaskSubmission from '../models/TaskSubmission.js';
import Family from '../models/Family.js';
import User from '../models/User.js';

// Review submission
export const reviewSubmission = async (req, res) => {
  try {
    const { submissionId, reviewStatus, adminNotes, believeValueAwarded } = req.body;
    const adminId = req.userId;

    const submission = await TaskSubmission.findByIdAndUpdate(
      submissionId,
      {
        reviewStatus,
        adminNotes,
        believeValueAwarded,
        reviewedAt: new Date(),
        reviewedBy: adminId
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update family believe value if approved
    if (reviewStatus === 'approved') {
      const family = await Family.findById(submission.familyId);
      family.believeValue += believeValueAwarded;
      
      family.completedTasks.push({
        taskId: submission.taskId,
        completedAt: new Date(),
        believeValueEarned: believeValueAwarded
      });

      await family.save();
    }

    res.json({
      message: 'Submission reviewed',
      submission
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get pending submissions
export const getPendingSubmissions = async (req, res) => {
  try {
    const { gameId } = req.query;

    const submissions = await TaskSubmission.find({
      reviewStatus: 'pending',
      ...(gameId && { gameId })
    })
      .populate('familyId', 'familyName')
      .populate('taskId', 'title description')
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get submission details
export const getSubmissionDetails = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await TaskSubmission.findById(submissionId)
      .populate('familyId')
      .populate('taskId')
      .populate('reviewedBy', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get submission stats
export const getSubmissionStats = async (req, res) => {
  try {
    const { gameId } = req.query;

    const submissions = await TaskSubmission.find(gameId ? { gameId } : {});

    const stats = {
      total: submissions.length,
      pending: submissions.filter(s => s.reviewStatus === 'pending').length,
      approved: submissions.filter(s => s.reviewStatus === 'approved').length,
      rejected: submissions.filter(s => s.reviewStatus === 'rejected').length,
      totalBelieveValueAwarded: submissions.reduce((sum, s) => sum + (s.believeValueAwarded || 0), 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
