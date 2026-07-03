import express from 'express';
import * as familyController from '../controllers/familyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, familyController.createFamily);
router.get('/', authenticate, familyController.getFamily);
router.put('/', authenticate, familyController.updateFamily);
router.put('/location', authenticate, familyController.updateLocation);
router.get('/rankings', familyController.getFamilyRankings);

export default router;
