const { body, query } = require("express-validator");

const updateMeRules = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit faire entre 3 et 30 caractères"),
  body("avatarUrl")
    .optional({ values: "falsy" })   // accepte la chaîne vide : effacer son avatar
    .trim()
    .isURL()
    .withMessage("URL d'avatar invalide"),
];

const searchRules = [
  query("q")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("La recherche doit faire au moins 2 caractères"),
];

module.exports = { updateMeRules, searchRules };