import express from 'express';
import { analyzeRisk, getRiskHistory } from '../controllers/riskController';

const router = express.Router();

router.post('/analyze', analyzeRisk);
router.get('/history', getRiskHistory);

export default router;