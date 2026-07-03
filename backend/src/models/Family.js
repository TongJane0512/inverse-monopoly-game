import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  familyName: {
    type: String,
    required: [true, 'Please provide a family name']
  },
  members: [{
    name: String,
    age: Number,
    role: {
      type: String,
      enum: ['parent', 'child'],
      default: 'child'
    }
  }],
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  // Game state
  currentPosition: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  believeValue: {
    type: Number,
    default: 0
  },
  properties: [{
    propertyId: mongoose.Schema.Types.ObjectId,
    acquiredAt: Date
  }],
  completedTasks: [{
    taskId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    believeValueEarned: Number
  }],
  status: {
    type: String,
    enum: ['registered', 'in_progress', 'completed', 'withdrawn'],
    default: 'registered'
  },
  joinedAt: {
    type: Date,
    default: Date.now
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

// Index for faster queries
familySchema.index({ userId: 1 });
familySchema.index({ gameId: 1 });

export default mongoose.model('Family', familySchema);
