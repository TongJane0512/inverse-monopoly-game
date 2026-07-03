import express from 'express';
import * as videoController from '../controllers/videoController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/review', authenticate, adminOnly, videoController.reviewSubmission);
router.get('/pending', authenticate, adminOnly, videoController.getPendingSubmissions);
router.get('/:submissionId', authenticate, videoController.getSubmissionDetails);
router.get('/stats', authenticate, adminOnly, videoController.getSubmissionStats);

export default router;
