const env = require("../config/env");

// 404 : aucune route n'a répondu
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route introuvable : ${req.method} ${req.originalUrl}` });
}

// Gestionnaire central : TOUTES les erreurs de l'API finissent ici
function errorHandler(err, req, res, next) {
  // Erreurs de validation Mongoose → 400 avec le détail des champs
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Données invalides", details });
  }
  // Doublon d'index unique (email/username déjà pris) → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `Ce ${field} est déjà utilisé` });
  }
  // ObjectId malformé dans une URL → 400
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Identifiant invalide" });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 && env.nodeEnv === "production" ? "Erreur interne du serveur" : err.message,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };