import express from 'express';
import * as gameController from '../controllers/gameController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, adminOnly, gameController.createGame);
router.get('/', gameController.getAllGames);
router.get('/:gameId', gameController.getGameById);
router.post('/register', authenticate, gameController.registerFamily);
router.post('/start', authenticate, adminOnly, gameController.startGame);
router.post('/end', authenticate, adminOnly, gameController.endGame);
router.get('/:gameId/stats', gameController.getGameStats);

export default router;
