const { body } = require("express-validator");

const createRoomRules = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Le nom du salon doit faire entre 3 et 50 caractères"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La description ne peut pas dépasser 200 caractères"),
];

module.exports = { createRoomRules };