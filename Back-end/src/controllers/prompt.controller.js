import { createPrompt, getPromptById, getUserPrompts, getPublicPrompts, updatePrompt, deletePrompt, incrementPromptUsage } from "../services/prompt.service.js";

export async function createPromptController(req, res, next) {
  try {
    const { title, content, description, tags, isPublic } = req.body;
    if (!title || !content) throw { status: 400, message: "Título e conteúdo são obrigatórios" };
    
    const userId = req.user.id;
    const prompt = await createPrompt({ title, content, description, tags, isPublic, userId });
    res.status(201).json(prompt);
  } catch (e) { next(e); }
}

export async function getPromptController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const prompt = await getPromptById(id, userId);
    res.json(prompt);
  } catch (e) { next(e); }
}

export async function getUserPromptsController(req, res, next) {
  try {
    const userId = req.user.id;
    const prompts = await getUserPrompts(userId);
    res.json(prompts);
  } catch (e) { next(e); }
}

export async function getPublicPromptsController(req, res, next) {
  try {
    const prompts = await getPublicPrompts();
    res.json(prompts);
  } catch (e) { next(e); }
}

export async function updatePromptController(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, description, tags, isPublic } = req.body;
    if (!title || !content) throw { status: 400, message: "Título e conteúdo são obrigatórios" };
    
    const userId = req.user.id;
    const prompt = await updatePrompt({ id, title, content, description, tags, isPublic, userId });
    res.json(prompt);
  } catch (e) { next(e); }
}

export async function deletePromptController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await deletePrompt(id, userId);
    res.json(result);
  } catch (e) { next(e); }
}

export async function usePromptController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Primeiro verifica se o usuário tem acesso ao prompt
    const prompt = await getPromptById(id, userId);
    
    // Incrementa o contador de uso
    await incrementPromptUsage(id);
    
    res.json(prompt);
  } catch (e) { next(e); }
}