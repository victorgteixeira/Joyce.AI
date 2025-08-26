import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
  chatController,
  streamController,
  imageController,
  embeddingController
} from '../controllers/ai.controller.js';

const router = Router();

router.post('/chat',       auth, chatController);
router.post('/stream',     auth, streamController);
router.post('/image',      auth, imageController);
router.post('/embeddings', auth, embeddingController);

export default router;
