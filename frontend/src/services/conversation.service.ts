import api from './api';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  conversationId: string;
  createdAt: string;
};

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface CreateConversationData {
  title: string;
  initialMessage?: string;
}

export interface AddMessageData {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ConversationService = {
  createConversation: async (data: CreateConversationData): Promise<Conversation> => {
    const response = await api.post<Conversation>('/conversations', data);
    return response.data;
  },

  getUserConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/conversations/user');
    return response.data;
  },

  getConversationById: async (id: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  updateConversationTitle: async (id: string, title: string): Promise<Conversation> => {
    const response = await api.put<Conversation>(`/conversations/${id}/title`, { title });
    return response.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(`/conversations/${id}`);
  },

  addMessage: async (conversationId: string, data: AddMessageData): Promise<Message> => {
    const response = await api.post<Message>(`/conversations/${conversationId}/messages`, data);
    return response.data;
  },

  // Envia a mensagem para a IA e registra resposta
  chatWithAI: async (conversationId: string, message: string): Promise<Message> => {
    // 1) adiciona mensagem do usuário
    await ConversationService.addMessage(conversationId, {
      role: 'user',
      content: message
    });

    // 2) chama a API de IA
    const response = await api.post<{ message: string }>(
      '/ai/chat',
      { message, conversationId }
    );

    // 3) adiciona resposta da IA
    const aiMessage = await ConversationService.addMessage(conversationId, {
      role: 'assistant',
      content: response.data.message
    });

    return aiMessage;
  },
};

export default ConversationService;
