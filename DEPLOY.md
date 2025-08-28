# 🚀 Guia de Deploy - Joyce.AI

Este guia contém instruções para fazer deploy da aplicação Joyce.AI em diferentes plataformas.

## 📋 Pré-requisitos

- Conta no GitHub
- Chave da API OpenAI
- Conta em uma das plataformas de deploy (Vercel, Railway, Render, etc.)

## 🔧 Configuração das Variáveis de Ambiente

### Backend (.env)
```env
OPENAI_API_KEY=sua_chave_openai_aqui
PORT=3000
NODE_ENV=production
DATABASE_URL=sua_url_do_banco_aqui
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://sua-api-url.com
VITE_NODE_ENV=production
```

## 🌐 Deploy do Frontend

### Opção 1: Vercel (Recomendado)

1. **Conecte seu repositório:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub
   - Selecione a pasta `frontend`

2. **Configure as variáveis de ambiente:**
   ```
   VITE_API_URL=https://sua-api-url.com
   ```

3. **Deploy automático:**
   - O Vercel detectará automaticamente que é um projeto Vite
   - O deploy será feito automaticamente

### Opção 2: Netlify

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: `frontend`

2. **Configure as variáveis de ambiente no painel do Netlify**

## 🖥️ Deploy do Backend

### Opção 1: Railway (Recomendado)

1. **Conecte seu repositório:**
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Conecte seu repositório GitHub
   - Selecione a pasta `Back-end`

2. **Configure as variáveis de ambiente:**
   ```
   OPENAI_API_KEY=sua_chave_aqui
   NODE_ENV=production
   JWT_SECRET=seu_secret_aqui
   CORS_ORIGIN=https://seu-frontend.vercel.app
   ```

3. **Configure o banco de dados:**
   - Adicione um PostgreSQL plugin
   - A `DATABASE_URL` será configurada automaticamente

### Opção 2: Render

1. **Conecte seu repositório:**
   - Acesse [render.com](https://render.com)
   - Clique em "New Web Service"
   - Conecte seu repositório GitHub

2. **Configure o serviço:**
   - Root Directory: `Back-end`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Configure as variáveis de ambiente no painel do Render**

### Opção 3: Heroku

1. **Prepare o projeto:**
   ```bash
   # Instale o Heroku CLI
   heroku login
   heroku create joyce-ai-backend
   ```

2. **Configure as variáveis:**
   ```bash
   heroku config:set OPENAI_API_KEY=sua_chave
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=seu_secret
   ```

3. **Deploy:**
   ```bash
   git subtree push --prefix=Back-end heroku main
   ```

## 🐳 Deploy com Docker

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/victorgteixeira/Joyce.AI
cd Joyce.AI

# Configure as variáveis de ambiente
cp Back-end/.env.example Back-end/.env
cp frontend/.env.example frontend/.env

# Edite os arquivos .env com suas configurações

# Inicie os serviços
docker-compose up -d
```

### Produção

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Inicie em produção
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 CI/CD com GitHub Actions

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 📊 Monitoramento

### Health Check
O backend possui um endpoint de health check em `/health`:

```bash
curl https://sua-api-url.com/health
```

### Logs
- **Railway:** Acesse o painel e vá em "Deployments"
- **Render:** Acesse "Logs" no painel do serviço
- **Vercel:** Acesse "Functions" > "View Function Logs"

## 🔧 Troubleshooting

### Problemas Comuns

1. **CORS Error:**
   - Verifique se `CORS_ORIGIN` está configurado corretamente
   - Certifique-se de que a URL do frontend está correta

2. **Database Connection:**
   - Verifique se `DATABASE_URL` está configurada
   - Execute `npm run prisma:migrate:deploy` após o deploy

3. **OpenAI API Error:**
   - Verifique se `OPENAI_API_KEY` está configurada
   - Confirme se há créditos na conta OpenAI

4. **Build Errors:**
   - Verifique se todas as dependências estão no `package.json`
   - Confirme se as versões do Node.js são compatíveis

### Comandos Úteis

```bash
# Verificar logs do Railway
railway logs

# Executar migrações no Render
npm run prisma:migrate:deploy

# Verificar status do deploy
curl -I https://sua-api-url.com/health
```

## 📞 Suporte

Se encontrar problemas durante o deploy:

1. Verifique os logs da plataforma
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste os endpoints localmente primeiro
4. Consulte a documentação da plataforma de deploy

---

**Nota:** Lembre-se de nunca commitar arquivos `.env` com credenciais reais no repositório público!