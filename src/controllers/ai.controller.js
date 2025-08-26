import {
  chatService,
  streamService,
  imageService,
  embeddingService
} from '../services/ai.service.js';

export async function chatController(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt) throw { status: 400, message: 'prompt é obrigatório' };

    const { text, retries } = await chatService(prompt);
    res.json({
      text,
      retries,
      info: retries > 0 ? `Resposta obtida após ${retries} retry(s)` : 'Resposta obtida sem retry'
    });
  } catch (err) {
    if (err?.status === 429 || err?.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'Sem créditos ou limite atingido no projeto da OpenAI.',
        retries: err.retries || 0
      });
    }
    next(err);
  }
}

export async function streamController(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt) throw { status: 400, message: 'prompt é obrigatório' };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { retries } = await streamService(
      prompt,
      (chunk) => res.write(`data: ${chunk}\n\n`),
      () => res.end()
    );

    res.write(`event: meta\ndata: ${JSON.stringify({ retries })}\n\n`);
  } catch (err) {
    next(err);
  }
}

export async function imageController(req, res, next) {
  try {
    const { prompt, size } = req.body;
    if (!prompt) throw { status: 400, message: 'prompt é obrigatório' };
    const { base64, retries } = await imageService(prompt, size);
    res.json({ base64, retries });
  } catch (err) {
    next(err);
  }
}

export async function embeddingController(req, res, next) {
  try {
    const { input } = req.body;
    if (!input) throw { status: 400, message: 'input é obrigatório' };
    const { vector, retries } = await embeddingService(input);
    res.json({ vector, retries });
  } catch (err) {
    next(err);
  }
}
