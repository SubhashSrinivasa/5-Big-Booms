import express from 'express';
import newsController from '../controllers/newsController.js';
import { updateNews } from '../controllers/updateController.js';

const router = express.Router();

router.get('/news', newsController.fetchNews);
router.get('/update-news', updateNews);

export default router;