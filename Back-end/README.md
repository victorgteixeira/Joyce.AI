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
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz:

```env
OPENAI_API_KEY=CHAVE_DA_API
PORT=3000
```

Inicie o servidor:

```bash
npm run dev
# ou
npm start
```

---

## 🌐 URL Base

- Local: `http://localhost:3000`  
- Rede interna (exemplo): `http://192.168.0.10:3000`  

---

## 📍 Endpoints

### 1. **Chat**
- **POST** `/ai/chat`  
- Gera resposta textual da IA.

**Body:**
```json
{
  "prompt": "Explique programação orientada a objetos em 2 linhas."
}
```

**Resposta:**
```json
{
  "text": "Programação orientada a objetos organiza o código em classes e objetos.",
  "retries": 0,
  "info": "Resposta obtida sem retry"
}
```

---

### 2. **Streaming**
- **POST** `/ai/stream`  
- Retorna resposta em **text/event-stream (SSE)**.

**Body:**
```json
{
  "prompt": "Escreva um haikai sobre tecnologia e nuvens."
}
```

**Resposta (fluxo SSE):**
```
data: Escrevendo...
data: linha por linha...
event: meta
data: {"retries":0}
```

---

### 3. **Imagem**
- **POST** `/ai/image`  
- Gera imagem a partir de prompt em **Base64**.  
⚠️ **Necessário verificar sua organização no painel da OpenAI** para usar o modelo `gpt-image-1`.

**Tamanhos suportados:** `1024x1024`, `1024x1536`, `1536x1024`, `auto`

**Body:**
```json
{
  "prompt": "um robô pintando um quadro futurista",
  "size": "1024x1024"
}
```

**Resposta:**
```json
{
  "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "retries": 0
}
```

---

### 4. **Embeddings**
- **POST** `/ai/embeddings`  
- Converte texto em vetor numérico.

**Body:**
```json
{
  "input": "JavaScript é uma linguagem de programação."
}
```

**Resposta:**
```json
{
  "vector": [0.0023, -0.0142, 0.1183, ...],
  "retries": 0
}
```

---

### 5. **Health Check**
- **GET** `/health`  
- Verifica se a API está ativa.

**Resposta:**
```json
{
  "ok": true,
  "uptime": 123.456
}
```

---

## ⚡ Tratamento de Erros

### 429 Too Many Requests
```json
{
  "error": "Sem créditos ou limite atingido no projeto da OpenAI.",
  "retries": 3
}
```

### 400 Bad Request
```json
{
  "error": "prompt é obrigatório"
}
```

### 500 Internal Error
```json
{
  "error": "Erro interno"
}
```

---

## 📊 Observações
- Modelo padrão: `gpt-4o-mini`  
- Saída limitada por: `max_output_tokens: 300`  
- Retry automático: até **3 tentativas** (2s → 4s → 8s)  
- Para usar imagens (`/ai/image`), é necessário **verificar sua organização** no painel da OpenAI.  

---

## 👥 Contribuição
1. Fork o projeto  
2. Crie uma branch (`git checkout -b feature/nova-feature`)  
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)  
4. Push para a branch (`git push origin feature/nova-feature`)  
5. Abra um Pull Request  

---

## 📄 Licença
Este projeto está sob a licença MIT.  
