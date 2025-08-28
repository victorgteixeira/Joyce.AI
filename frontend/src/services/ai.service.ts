import api from './api';

export interface ChatRequest {
  message: string;
  conversationId?: string;
  promptId?: string;
}

export interface ChatResponse {
  message: string;
  conversationId?: string;
}

export interface ImageRequest {
  prompt: string;
  size?: string;
}

export interface ImageResponse {
  url: string;
}

export interface EmbeddingRequest {
  text: string;
}

export interface EmbeddingResponse {
  embedding: number[];
}

const AIService = {
  chat: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/ai/chat', data);
    return response.data;
  },

  streamChat: async (data: ChatRequest, onChunk: (chunk: string) => void): Promise<void> => {
    const response = await api.post('/ai/stream', data, {
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const chunk = (progressEvent.event?.target as any)?.response;
        if (chunk) {
          onChunk(chunk);
        }
      },
    });
    return response.data;
  },

  generateImage: async (data: ImageRequest): Promise<ImageResponse> => {
    const response = await api.post<ImageResponse>('/ai/image', data);
    return response.data;
  },

  getEmbedding: async (data: EmbeddingRequest): Promise<EmbeddingResponse> => {
    const response = await api.post<EmbeddingResponse>('/ai/embeddings', data);
    return response.data;
  },
};

export default AIService;