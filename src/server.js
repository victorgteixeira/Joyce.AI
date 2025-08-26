import 'dotenv/config';
import express from 'express';
import aiRoutes from './routes/ai.routes.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();
app.use(express.json());

app.use('/ai', aiRoutes);
app.use('/', healthRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
