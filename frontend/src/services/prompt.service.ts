import api from './api';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface CreatePromptData {
  title: string;
  content: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdatePromptData {
  title?: string;
  content?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

const PromptService = {
  createPrompt: async (data: CreatePromptData): Promise<Prompt> => {
    const response = await api.post<Prompt>('/prompts', data);
    return response.data;
  },

  getUserPrompts: async (): Promise<Prompt[]> => {
    const response = await api.get<Prompt[]>('/prompts/user');
    return response.data;
  },

  getPublicPrompts: async (): Promise<Prompt[]> => {
    const response = await api.get<Prompt[]>('/prompts/public');
    return response.data;
  },

  getPromptById: async (id: string): Promise<Prompt> => {
    const response = await api.get<Prompt>(`/prompts/${id}`);
    return response.data;
  },

  updatePrompt: async (id: string, data: UpdatePromptData): Promise<Prompt> => {
    const response = await api.put<Prompt>(`/prompts/${id}`, data);
    return response.data;
  },

  deletePrompt: async (id: string): Promise<void> => {
    await api.delete(`/prompts/${id}`);
  },

  incrementUsage: async (id: string): Promise<Prompt> => {
    const response = await api.post<Prompt>(`/prompts/${id}/use`);
    return response.data;
  },
};

export default PromptService;