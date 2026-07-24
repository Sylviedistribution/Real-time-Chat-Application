const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { updateMeRules, searchRules } = require("../validators/user.validators");

router.use(requireAuth);

router.get("/search",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Rechercher des utilisateurs par pseudo'
    #swagger.description = 'Recherche insensible à la casse, limitée à dix résultats et excluant le demandeur. Les adresses email ne sont jamais exposées.'
    #swagger.parameters['q'] = { in: 'query', required: true, schema: { type: 'string', minLength: 2, maxLength: 30 }, example: 'aw' }
    #swagger.responses[200] = { description: "Liste des utilisateurs correspondants" }
    #swagger.responses[400] = { description: "Requête trop courte (moins de 2 caractères)" }
    #swagger.responses[401] = { description: "Non authentifié" }
  */
  searchRules, validate, ctrl.search);

router.patch("/me",
  /*
    #swagger.tags = ['Users']
    #swagger.summary = 'Mettre à jour son profil'
    #swagger.description = 'Mise à jour partielle : seuls les champs fournis sont modifiés.'
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: {
        type: "object",
        properties: {
          username: { type: "string", minLength: 3, maxLength: 30 },
          avatarUrl: { type: "string", format: "uri" }
        }
      } } }
    }
    #swagger.responses[200] = { description: "Profil mis à jour" }
    #swagger.responses[400] = { description: "Données invalides" }
    #swagger.responses[401] = { description: "Non authentifié" }
    #swagger.responses[409] = { description: "Nom d'utilisateur déjà pris" }
  */
  updateMeRules, validate, ctrl.updateMe);

module.exports = router;