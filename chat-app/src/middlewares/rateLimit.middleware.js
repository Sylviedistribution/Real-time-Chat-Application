const rateLimit = require("express-rate-limit");

// Limiteur global : large, protège toute l'API contre les abus grossiers
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,      // fenêtre de 15 minutes
  max: 300,                       // 300 requêtes par IP et par fenêtre
  standardHeaders: true,          // en-têtes RateLimit-* normalisés dans la réponse
  legacyHeaders: false,
  message: { success: false, message: "Trop de requêtes, réessayez dans quelques minutes" },
});

// Limiteur d'authentification : sévère, anti brute-force (câblé au Lot B2)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                        // 10 tentatives de login/register par IP par 15 min
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: { success: false, message: "Trop de tentatives, réessayez dans 15 minutes" },
});

module.exports = { globalLimiter, authLimiter };