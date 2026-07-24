const router = require("express").Router();
const ctrl = require("../controllers/message.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { getMessagesRules, createMessageRules } = require("../validators/message.validators");

router.use(requireAuth);

router.get("/:channelId",
  /*
    #swagger.tags = ['Messages']
    #swagger.summary = "Historique paginé d'un canal"
    #swagger.description = 'Le canal peut être un salon ou une conversation : le serveur détermine le type et vérifie l\'accès. Messages renvoyés du plus ancien au plus récent, la page 1 contenant les plus récents.'
    #swagger.parameters['page'] = { in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limit'] = { in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 30 } }
    #swagger.responses[200] = { description: "Tranche de l'historique avec pagination" }
    #swagger.responses[400] = { description: "Paramètre de page invalide" }
    #swagger.responses[403] = { description: "Accès au canal refusé" }
    #swagger.responses[404] = { description: "Canal introuvable" }
  */
  getMessagesRules, validate, ctrl.getMessages);

router.post("/:channelId",
  /*
    #swagger.tags = ['Messages']
    #swagger.summary = 'Envoyer un message (voie REST)'
    #swagger.description = 'Voie REST, utilisée notamment par les tests. En usage normal, le client envoie ses messages par Socket.IO, qui appelle le même service et applique les mêmes contrôles.'
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: {
        type: "object",
        required: ["content"],
        properties: { content: { type: "string", minLength: 1, maxLength: 2000, example: "Bonjour à tous" } }
      } } }
    }
    #swagger.responses[201] = { description: "Message enregistré" }
    #swagger.responses[400] = { description: "Contenu vide ou trop long" }
    #swagger.responses[403] = { description: "Accès au canal refusé" }
    #swagger.responses[404] = { description: "Canal introuvable" }
  */
  createMessageRules, validate, ctrl.createMessage);

module.exports = router;