export function errorHandler(err, req, res, next) {
  const status = err.status || err.response?.status || 500;
  const openaiMsg = err.response?.data?.error?.message;
  const msg = err.message || openaiMsg || 'Erro interno';

  console.error('[ERROR]', {
    status,
    code: err.code,
    message: msg,
  });

  res.status(status).json({
    error: msg,
    code: err.code,
    details: err.details || undefined,
    retries: err.retries || 0
  });
}
