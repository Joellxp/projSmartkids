function errorHandler(err, req, res, next) {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor"
  });
}

module.exports = errorHandler;