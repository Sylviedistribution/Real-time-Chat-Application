const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

// Ne jamais exposer le document Mongoose brut : on choisit ce qui sort
function toPublicUser(user) {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    status: user.status,
  };
}

async function register({ username, email, password }) {
  const user = await User.create({ username, email, password });
  // Le hash bcrypt ? Déjà fait — hook pre("save") du modèle (Phase 5)
  return { user: toPublicUser(user), token: signToken(user._id) };
}

async function login({ email, password }) {
  // select("+password") : le champ est en select:false, on le demande explicitement
  const user = await User.findOne({ email }).select("+password");

  // Message VOLONTAIREMENT identique dans les deux cas (diagramme d'activité, Phase 4)
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Identifiants invalides");
  }

  return { user: toPublicUser(user), token: signToken(user._id) };
}

module.exports = { register, login, toPublicUser };