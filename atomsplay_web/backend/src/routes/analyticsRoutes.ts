import express from 'express';
import { getModelInsights, getModelMetrics } from '../controllers/analyticsController';

const router = express.Router();

router.get('/insights', getModelInsights);
router.get('/metrics', getModelMetrics);

export default router;