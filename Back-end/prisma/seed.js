import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'victorteixeira@jauserve.com.br';
  const password = '123456';

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'VITEIXEIRA',
      passwordHash: hash,
      role: 'admin'
    }
  });

  console.log('Usuário admin criado:', admin);

  // Criar alguns prompts de exemplo
  const prompts = [
    {
      title: 'Assistente de Programação',
      content: 'Você é um assistente especializado em programação. Ajude o usuário com questões de código, debugging e melhores práticas.',
      description: 'Prompt para assistência em programação e desenvolvimento',
      tags: 'programação,código,desenvolvimento',
      isPublic: true,
      userId: admin.id
    },
    {
      title: 'Revisor de Texto',
      content: 'Você é um revisor de texto experiente. Corrija erros gramaticais, melhore a clareza e sugira melhorias no texto fornecido.',
      description: 'Prompt para revisão e melhoria de textos',
      tags: 'texto,revisão,gramática',
      isPublic: true,
      userId: admin.id
    },
    {
      title: 'Explicador Didático',
      content: 'Explique conceitos complexos de forma simples e didática, usando exemplos práticos e analogias quando necessário.',
      description: 'Prompt para explicações didáticas e educacionais',
      tags: 'educação,explicação,didática',
      isPublic: true,
      userId: admin.id
    }
  ];

  for (const promptData of prompts) {
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        title: promptData.title,
        userId: promptData.userId
      }
    });
    
    if (!existingPrompt) {
      await prisma.prompt.create({
        data: promptData
      });
    }
  }

  console.log('Prompts de exemplo criados');

  // Criar uma conversa de exemplo
  const conversation = await prisma.conversation.upsert({
    where: {
      id: 'example-conversation-id'
    },
    update: {},
    create: {
      id: 'example-conversation-id',
      title: 'Conversa de Boas-vindas',
      userId: admin.id
    }
  });

  // Criar mensagens de exemplo
  await prisma.message.upsert({
    where: {
      id: 'welcome-message-1'
    },
    update: {},
    create: {
      id: 'welcome-message-1',
      role: 'assistant',
      content: 'Olá! Bem-vindo ao Joyce.AI. Como posso ajudá-lo hoje?',
      conversationId: conversation.id
    }
  });

  console.log('Conversa de exemplo criada');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
