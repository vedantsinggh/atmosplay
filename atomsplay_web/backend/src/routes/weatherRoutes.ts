import express from 'express';
import { getCurrentWeather, getForecast } from '../controllers/weatherController';

const router = express.Router();

router.get('/current/:city', getCurrentWeather);
router.get('/forecast/:city', getForecast);

export default router;