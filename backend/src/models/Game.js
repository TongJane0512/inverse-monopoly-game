import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  description: String,
  basePrice: Number,
  order: Number
});

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: '逆境大富翁 - 澳門大潭山郊野公園'
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    name: {
      type: String,
      default: '澳門大潭山郊野公園'
    },
    latitude: {
      type: Number,
      default: 22.2008
    },
    longitude: {
      type: Number,
      default: 113.5439
    }
  },
  properties: [propertySchema],
  maxFamilies: {
    type: Number,
    default: 10
  },
  registeredFamilies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  }],
  believeValuePerTask: {
    type: Number,
    default: 10
  },
  bossBattleRequired: {
    type: Number,
    default: 5
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

export default mongoose.model('Game', gameSchema);
