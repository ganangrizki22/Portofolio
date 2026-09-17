// Middleware penanganan error terpusat.
// Setiap route/controller yang memanggil next(err) akan berakhir di sini.
function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server",
  });
}

// Middleware untuk menangani route yang tidak ditemukan (404).
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
}

module.exports = { errorHandler, notFoundHandler };
