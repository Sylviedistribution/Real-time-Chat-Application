const { body, query } = require("express-validator");

const getMessagesRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de page doit être un entier positif")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("La limite doit être comprise entre 1 et 100")
    .toInt(),
];

const createMessageRules = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Le message doit contenir entre 1 et 2000 caractères"),
];

module.exports = { getMessagesRules, createMessageRules };