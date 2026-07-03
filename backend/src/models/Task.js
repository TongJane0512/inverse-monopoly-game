import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    enum: ['crisis', 'opportunity', 'belief', 'challenge'],
    default: 'crisis'
  },
  // For crisis tasks
  beliefRequired: {
    type: String,
    enum: ['compassion', 'hope', 'faith', 'perseverance'],
    default: 'faith'
  },
  // Assigned families
  assignedFamilies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  }],
  // Task requirements
  requiresVideo: {
    type: Boolean,
    default: true
  },
  requiresPhoto: {
    type: Boolean,
    default: false
  },
  requiresAnswer: {
    type: Boolean,
    default: false
  },
  // Reward
  believeValueReward: {
    type: Number,
    default: 10
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  // Scheduling
  scheduledTime: Date,
  expiresAt: Date,
  // Stats
  completionCount: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.index({ gameId: 1 });
taskSchema.index({ status: 1 });

export default mongoose.model('Task', taskSchema);
