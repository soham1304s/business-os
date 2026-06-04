import { Router } from 'express';
import { getDeals, updateDealStage, seedDeals, getDealDetails, createDealTask, updateTaskStatus } from '../controllers/crm.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/deals', getDeals);
router.put('/deals/:id/stage', updateDealStage);
router.post('/deals/seed', seedDeals);
router.get('/deals/:id/details', getDealDetails);
router.post('/deals/:id/tasks', createDealTask);
router.put('/tasks/:id', updateTaskStatus);

export default router;
