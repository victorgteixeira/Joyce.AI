import { prisma } from "../utils/prisma.js";

export async function createConversation({ title, userId }) {
  const conversation = await prisma.conversation.create({
    data: {
      title: title || `Conversa ${new Date().toLocaleString('pt-BR')}`,
      userId
    }
  });
  return conversation;
}

export async function getConversationById(id, userId) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      userId
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
  if (!conversation) throw { status: 404, message: "Conversa não encontrada" };
  return conversation;
}

export async function getUserConversations(userId) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function updateConversationTitle(id, title, userId) {
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) throw { status: 404, message: "Conversa não encontrada" };
  if (conversation.userId !== userId) throw { status: 403, message: "Acesso negado" };

  return prisma.conversation.update({
    where: { id },
    data: {
      title,
      updatedAt: new Date()
    }
  });
}

export async function deleteConversation(id, userId) {
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) throw { status: 404, message: "Conversa não encontrada" };
  if (conversation.userId !== userId) throw { status: 403, message: "Acesso negado" };

  // Isso vai excluir automaticamente todas as mensagens relacionadas devido ao onDelete: Cascade
  await prisma.conversation.delete({ where: { id } });
  return { message: "Conversa excluída com sucesso" };
}

export async function addMessage({ conversationId, role, content }) {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) throw { status: 404, message: "Conversa não encontrada" };

  const message = await prisma.message.create({
    data: {
      role,
      content,
      conversationId
    }
  });

  // Atualiza o timestamp da conversa
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() }
  });

  return message;
}