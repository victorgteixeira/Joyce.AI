import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
  createPromptController,
  getPromptController,
  getUserPromptsController,
  getPublicPromptsController,
  updatePromptController,
  deletePromptController,
  usePromptController
} from '../controllers/prompt.controller.js';

const router = Router();

router.post('/',           auth, createPromptController);
router.get('/user',        auth, getUserPromptsController);
router.get('/public',      auth, getPublicPromptsController);
router.get('/:id',         auth, getPromptController);
router.put('/:id',         auth, updatePromptController);
router.delete('/:id',      auth, deletePromptController);
router.post('/:id/use',    auth, usePromptController);

export default router;