import { Router } from 'express';
import {
  chatController,
  streamController,
  imageController,
  embeddingController
} from '../controllers/ai.controller.js';

const router = Router();

router.post('/chat', chatController);
router.post('/stream', streamController);
router.post('/image', imageController);
router.post('/embeddings', embeddingController);

export default router;
