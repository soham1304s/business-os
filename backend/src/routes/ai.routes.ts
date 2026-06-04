import { Router } from 'express';
import { handleChat, draftAssistant } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/chat', authenticate, handleChat);
router.post('/draft-assistant', authenticate, draftAssistant);

export default router;
