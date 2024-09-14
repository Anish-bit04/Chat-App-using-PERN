import express from 'express';
import { sendMessage, getMessage, getUser } from '../controllers/messages.controller.js';
import protectRoute from '../middlewares/protectRoute.js';
const router = express.Router();
router.get('/conversations', protectRoute, getUser);
router.get('/:id', protectRoute, getMessage);
router.post('/send/:id', protectRoute, sendMessage);
export default router;
