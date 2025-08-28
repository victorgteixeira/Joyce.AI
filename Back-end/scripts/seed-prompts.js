import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPrompts() {
  try {
    // Buscar um usuário existente para associar os prompts
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('Nenhum usuário encontrado. Execute o seed de usuários primeiro.');
      return;
    }

    console.log('Criando prompts de exemplo...');

    const prompts = [
      {
        title: 'Assistente de Programação',
        content: 'Você é um assistente especializado em programação. Ajude o usuário com questões de código, debugging e melhores práticas.',
        description: 'Prompt para assistência em programação e desenvolvimento',
        tags: 'programação,código,desenvolvimento',
        isPublic: true,
        userId: user.id,
        usageCount: 5
      },
      {
        title: 'Revisor de Texto',
        content: 'Você é um revisor de texto experiente. Corrija erros gramaticais, melhore a clareza e sugira melhorias no texto fornecido.',
        description: 'Prompt para revisão e melhoria de textos',
        tags: 'revisão,texto,gramática',
        isPublic: true,
        userId: user.id,
        usageCount: 3
      },
      {
        title: 'Explicador Didático',
        content: 'Explique conceitos complexos de forma simples e didática, usando exemplos práticos e analogias quando necessário.',
        description: 'Prompt para explicações didáticas e educacionais',
        tags: 'educação,explicação,didática',
        isPublic: true,
        userId: user.id,
        usageCount: 8
      },
      {
        title: 'Brainstorming Criativo',
        content: 'Você é um facilitador de brainstorming criativo. Gere ideias inovadoras e soluções criativas para os problemas apresentados.',
        description: 'Prompt para sessões de brainstorming e criatividade',
        tags: 'criatividade,brainstorming,ideias',
        isPublic: false,
        userId: user.id,
        usageCount: 2
      },
      {
        title: 'Analista de Dados',
        content: 'Você é um analista de dados experiente. Ajude a interpretar dados, criar visualizações e extrair insights valiosos.',
        description: 'Prompt para análise e interpretação de dados',
        tags: 'dados,análise,insights',
        isPublic: true,
        userId: user.id,
        usageCount: 6
      }
    ];

    for (const promptData of prompts) {
      const existingPrompt = await prisma.prompt.findFirst({
        where: {
          title: promptData.title,
          userId: user.id
        }
      });

      if (!existingPrompt) {
        await prisma.prompt.create({
          data: promptData
        });
        console.log(`✓ Prompt criado: ${promptData.title}`);
      } else {
        console.log(`- Prompt já existe: ${promptData.title}`);
      }
    }

    console.log('\nPrompts de exemplo criados com sucesso!');
    
    // Mostrar estatísticas
    const totalPrompts = await prisma.prompt.count();
    const publicPrompts = await prisma.prompt.count({ where: { isPublic: true } });
    const userPrompts = await prisma.prompt.count({ where: { userId: user.id } });
    
    console.log(`\nEstatísticas:`);
    console.log(`- Total de prompts: ${totalPrompts}`);
    console.log(`- Prompts públicos: ${publicPrompts}`);
    console.log(`- Prompts do usuário: ${userPrompts}`);
    
  } catch (error) {
    console.error('Erro ao criar prompts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPrompts();