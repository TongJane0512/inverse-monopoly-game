import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.js';
import familyRoutes from './routes/family.js';
import gameRoutes from './routes/game.js';
import taskRoutes from './routes/task.js';
import videoRoutes from './routes/video.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`🔗 Client connected: ${socket.id}`);

  // Family joins game room
  socket.on('join-game', (data) => {
    const roomId = `game-${data.gameId}`;
    socket.join(roomId);
    io.to(roomId).emit('family-joined', {
      familyId: data.familyId,
      familyName: data.familyName,
      timestamp: new Date()
    });
  });

  // Location update
  socket.on('location-update', (data) => {
    const roomId = `game-${data.gameId}`;
    io.to(roomId).emit('location-updated', {
      familyId: data.familyId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date()
    });
  });

  // Task completion
  socket.on('task-completed', (data) => {
    io.to(`admin-room`).emit('task-completed-notification', {
      familyId: data.familyId,
      taskId: data.taskId,
      timestamp: new Date()
    });
  });

  // Admin notification
  socket.on('admin-notification', (data) => {
    io.to(`game-${data.gameId}`).emit('notification', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🎮 Game environment: ${process.env.NODE_ENV}`);
});

export default app;
