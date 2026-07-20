const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function me(req, res) {
  // req.user vient de requireAuth
  res.json({ success: true, user: authService.toPublicUser(req.user) });
}

module.exports = { register, login, me };