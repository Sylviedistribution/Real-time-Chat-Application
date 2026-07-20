const { body } = require("express-validator");

const registerRules = [
  body("username").trim().isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit faire entre 3 et 30 caractères"),
  body("email").trim().isEmail().normalizeEmail()
    .withMessage("Format d'email invalide"),
  body("password").isLength({ min: 8 })
    .withMessage("Le mot de passe doit faire 8 caractères minimum"),
];

const loginRules = [
  body("email").trim().isEmail().withMessage("Format d'email invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est obligatoire"),
];

module.exports = { registerRules, loginRules };