import mongoose from 'mongoose';

const taskSubmissionSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  // Submission content
  videoUrl: String,
  photoUrls: [String],
  textAnswer: String,
  // Review
  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  adminNotes: String,
  // Reward
  believeValueAwarded: {
    type: Number,
    default: 0
  },
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

taskSubmissionSchema.index({ taskId: 1, familyId: 1 });
taskSubmissionSchema.index({ gameId: 1 });
taskSubmissionSchema.index({ reviewStatus: 1 });

export default mongoose.model('TaskSubmission', taskSubmissionSchema);
