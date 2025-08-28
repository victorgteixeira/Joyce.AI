export function errorHandler(err, req, res, next) {
  const status = err.status || err.response?.status || 500;
  const openaiMsg = err.response?.data?.error?.message;
  const msg = err.message || openaiMsg || 'Erro interno';

  // Log detalhado apenas para erros que não são de autenticação
  // (os erros de auth já são logados no auth.service.js)
  if (!req.path.includes('/auth/')) {
    console.error('[ERROR]', {
      status,
      code: err.code,
      message: msg,
      path: req.path,
      method: req.method
    });
  }

  res.status(status).json({
    error: msg,
    code: err.code,
    details: err.details || undefined,
    retries: err.retries || 0
  });
}
