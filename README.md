# 🤖 Joyce.AI

**Joyce.AI** é uma API em **Node.js (Express)** que atua como um **proxy para a OpenAI**, oferecendo endpoints para:

- 💬 **Chat** (`/ai/chat`)
- ⏳ **Streaming de respostas** (`/ai/stream`)
- 🖼️ **Geração de imagens** (`/ai/image`)
- 🧮 **Embeddings** (`/ai/embeddings`)
- ✅ **Health check** (`/health`)

A API já vem com:
- **Retry automático** em caso de erro `429 Too Many Requests` (com backoff exponencial).  
- **Controle de tokens de saída** com `max_output_tokens` para reduzir custo.  
- Documentação dos endpoints para fácil integração via Postman ou outra ferramenta.

---

## 🚀 Tecnologias
- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [OpenAI Node SDK](https://www.npmjs.com/package/openai)  
- [dotenv](https://www.npmjs.com/package/dotenv)  

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/victorgteixeira/Joyce.AI
cd joyce-ai
