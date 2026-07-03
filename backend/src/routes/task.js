import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, adminOnly, taskController.createTask);
router.post('/assign', authenticate, adminOnly, taskController.assignTask);
router.get('/my-tasks', authenticate, taskController.getTasksForFamily);
router.post('/submit', authenticate, taskController.submitTask);
router.get('/', authenticate, adminOnly, taskController.getAllTasks);

export default router;
