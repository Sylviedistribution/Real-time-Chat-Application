const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentification requise");
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret); // lève si signature invalide ou expiré

    const user = await User.findById(payload.userId);
    if (!user) throw new ApiError(401, "Utilisateur introuvable");

    req.user = user;   // toute la suite de la chaîne connaît l'utilisateur
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Session invalide ou expirée"));
    }
    next(err);
  }
}

module.exports = requireAuth;