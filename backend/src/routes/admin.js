import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, adminOnly);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/families', adminController.getAllFamiliesDetails);
router.get('/submissions', adminController.getAllSubmissions);
router.post('/notify', adminController.sendNotification);
router.get('/locations', adminController.getFamilyLocations);
router.get('/export/:gameId', adminController.exportGameData);

export default router;
