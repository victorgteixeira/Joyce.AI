import { createConversation, getConversationById, getUserConversations, updateConversationTitle, deleteConversation, addMessage } from "../services/conversation.service.js";

export async function createConversationController(req, res, next) {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const conversation = await createConversation({ title, userId });
    res.status(201).json(conversation);
  } catch (e) { next(e); }
}

export async function getConversationController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const conversation = await getConversationById(id, userId);
    res.json(conversation);
  } catch (e) { next(e); }
}

export async function getUserConversationsController(req, res, next) {
  try {
    const userId = req.user.id;
    const conversations = await getUserConversations(userId);
    res.json(conversations);
  } catch (e) { next(e); }
}

export async function updateConversationTitleController(req, res, next) {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) throw { status: 400, message: "Título é obrigatório" };
    
    const userId = req.user.id;
    const conversation = await updateConversationTitle(id, title, userId);
    res.json(conversation);
  } catch (e) { next(e); }
}

export async function deleteConversationController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await deleteConversation(id, userId);
    res.json(result);
  } catch (e) { next(e); }
}

export async function addMessageController(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { role, content } = req.body;
    if (!role || !content) throw { status: 400, message: "Role e conteúdo são obrigatórios" };
    if (role !== 'user' && role !== 'assistant') throw { status: 400, message: "Role deve ser 'user' ou 'assistant'" };
    
    // Verifica se a conversa pertence ao usuário
    const userId = req.user.id;
    await getConversationById(conversationId, userId);
    
    const message = await addMessage({ conversationId, role, content });
    res.status(201).json(message);
  } catch (e) { next(e); }
}