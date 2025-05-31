const path = require('path');
const fs = require('fs');

exports.uploadFile = (req, res, next) => {
  if (!req.file) {
    const err = new Error("Nenhum arquivo enviado.");
    err.status = 400;
    return next(err);
  }
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
};

exports.listFiles = (req, res, next) => {
  const dir = path.join(__dirname, '../uploads');
  fs.readdir(dir, (err, files) => {
    if (err) return next(err);
    res.json(files); // <-- Deve ser um array
  });
};