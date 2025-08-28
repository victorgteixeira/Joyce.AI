import { prisma } from "../utils/prisma.js";

// Função auxiliar para converter tags
function formatPromptForResponse(prompt) {
  if (!prompt) return prompt;
  return {
    ...prompt,
    tags: prompt.tags ? prompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
  };
}

function formatTagsForDatabase(tags) {
  if (Array.isArray(tags)) {
    return tags.join(',');
  }
  return tags || '';
}

export async function createPrompt({ title, content, description, tags, isPublic, userId }) {
  const prompt = await prisma.prompt.create({
    data: {
      title,
      content,
      description,
      tags: formatTagsForDatabase(tags),
      isPublic: isPublic || false,
      userId
    }
  });
  return formatPromptForResponse(prompt);
}

export async function getPromptById(id, userId) {
  const prompt = await prisma.prompt.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { isPublic: true }
      ]
    }
  });
  if (!prompt) throw { status: 404, message: "Prompt não encontrado" };
  return formatPromptForResponse(prompt);
}

export async function getUserPrompts(userId) {
  const prompts = await prisma.prompt.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });
  return prompts.map(formatPromptForResponse);
}

export async function getPublicPrompts() {
  const prompts = await prisma.prompt.findMany({
    where: { isPublic: true },
    orderBy: { usageCount: 'desc' },
    take: 50
  });
  return prompts.map(formatPromptForResponse);
}

export async function updatePrompt({ id, title, content, description, tags, isPublic, userId }) {
  const prompt = await prisma.prompt.findUnique({ where: { id } });
  if (!prompt) throw { status: 404, message: "Prompt não encontrado" };
  if (prompt.userId !== userId) throw { status: 403, message: "Acesso negado" };

  const updatedPrompt = await prisma.prompt.update({
    where: { id },
    data: {
      title,
      content,
      description,
      tags: formatTagsForDatabase(tags),
      isPublic,
      updatedAt: new Date()
    }
  });
  return formatPromptForResponse(updatedPrompt);
}

export async function deletePrompt(id, userId) {
  const prompt = await prisma.prompt.findUnique({ where: { id } });
  if (!prompt) throw { status: 404, message: "Prompt não encontrado" };
  if (prompt.userId !== userId) throw { status: 403, message: "Acesso negado" };

  await prisma.prompt.delete({ where: { id } });
  return { message: "Prompt excluído com sucesso" };
}

export async function incrementPromptUsage(id) {
  return prisma.prompt.update({
    where: { id },
    data: {
      usageCount: { increment: 1 }
    }
  });
}