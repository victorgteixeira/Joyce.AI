import { openai } from '../utils/openai.js';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callWithRetry(fn, retries = 3, delay = 2000, attempt = 0) {
  try {
    const result = await fn();
    return { ...result, retries: attempt };
  } catch (err) {
    const retriableCodes = [429, 500, 502, 503, 504];
    const status = err?.status ?? err?.response?.status ?? err?.code;

    if (retriableCodes.includes(status) && retries > 0) {
      const nextDelay = delay * 2; 
      console.warn(`[WARN] ${status}. Retry ${attempt + 1} em ${delay}ms...`);
      await sleep(delay);
      return callWithRetry(fn, retries - 1, nextDelay, attempt + 1);
    }
    err.retries = attempt;
    throw err;
  }
}

export async function chatService(prompt) {
  return callWithRetry(async () => {
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      max_output_tokens: 300
    });
    return { text: response.output_text };
  });
}

export async function streamService(prompt, onText, onEnd) {
  return callWithRetry(async () => {
    const stream = await openai.responses.stream({
      model: 'gpt-4o-mini',
      input: prompt,
      max_output_tokens: 300
    });

    return await new Promise((resolve, reject) => {
      stream.on('text', onText);
      stream.on('end', () => { try { onEnd(); } catch {} ; resolve({}); });
      stream.on('error', (e) => reject(e));
    });
  });
}

export async function imageService(prompt, size = '1024x1024') {
  return callWithRetry(async () => {
    const img = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size
    });
    return { base64: img.data[0].b64_json };
  });
}

export async function embeddingService(input) {
  return callWithRetry(async () => {
    const emb = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input
    });
    return { vector: emb.data[0].embedding };
  });
}
