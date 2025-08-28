import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import {
  createConversationController,
  getConversationController,
  getUserConversationsController,
  updateConversationTitleController,
  deleteConversationController,
  addMessageController
} from '../controllers/conversation.controller.js';

const router = Router();

router.post('/',                 auth, createConversationController);
router.get('/user',              auth, getUserConversationsController);
router.get('/:id',               auth, getConversationController);
router.put('/:id/title',         auth, updateConversationTitleController);
router.delete('/:id',            auth, deleteConversationController);
router.post('/:conversationId/messages', auth, addMessageController);

export default router;