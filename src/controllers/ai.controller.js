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

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let finished = false;


    req.on('close', () => {
      if (!finished) {
        finished = true;
        try { res.end(); } catch {}
      }
    });

    res.write(': ping\n\n');

    const { retries } = await streamService(
      prompt,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      },
      () => {
        if (!finished) {
          finished = true;
          res.write(`event: meta\ndata: ${JSON.stringify({ retries })}\n\n`);
          res.end();
        }
      }
    );
  } catch (err) {
    next(err);
  }
}

const ALLOWED_SIZES = new Set(['1024x1024','1024x1536','1536x1024','auto']);

export async function imageController(req, res, next) {
  try {
    const { prompt, size = '1024x1024' } = req.body;
    if (!prompt) throw { status: 400, message: 'prompt é obrigatório' };
    if (!ALLOWED_SIZES.has(size)) {
      throw { status: 400, message: `size inválido. Use um de: ${[...ALLOWED_SIZES].join(', ')}` };
    }

    const { base64, retries } = await imageService(prompt, size);
    res.json({ image: `data:image/png;base64,${base64}`, retries });
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
