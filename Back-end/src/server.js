import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import aiRoutes from './routes/ai.routes.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import promptRoutes from './routes/prompt.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use('/auth', authRoutes);
app.use(healthRoutes);       
app.use('/ai', aiRoutes);    
app.use('/prompts', promptRoutes);
app.use('/conversations', conversationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`API acessível na rede em http://${HOST}:${PORT}`);
});
