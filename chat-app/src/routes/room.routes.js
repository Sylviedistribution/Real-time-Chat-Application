const router = require("express").Router();
const ctrl = require("../controllers/room.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createRoomRules } = require("../validators/room.validators");

router.use(requireAuth);

router.get("/",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Lister les salons publics'
    #swagger.description = 'Renvoie tous les salons publics avec leur propriétaire et leurs membres peuplés.'
    #swagger.responses[200] = { description: "Liste des salons" }
    #swagger.responses[401] = { description: "Non authentifié" }
  */
  ctrl.list);

router.post("/",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Créer un salon'
    #swagger.description = 'Le créateur devient automatiquement propriétaire et premier membre.'
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 50, example: "projet-react" },
          description: { type: "string", maxLength: 200 }
        }
      } } }
    }
    #swagger.responses[201] = { description: "Salon créé" }
    #swagger.responses[400] = { description: "Données invalides" }
    #swagger.responses[409] = { description: "Nom de salon déjà pris" }
  */
  createRoomRules, validate, ctrl.create);

router.get("/:roomId",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Récupérer un salon'
    #swagger.responses[200] = { description: "Salon trouvé" }
    #swagger.responses[401] = { description: "Non authentifié" }
    #swagger.responses[404] = { description: "Salon introuvable" }
  */
  ctrl.getOne);

router.post("/:roomId/join",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Rejoindre un salon'
    #swagger.description = "Refusé si l'utilisateur est banni (403) ou déjà membre (409)."
    #swagger.responses[200] = { description: "Adhésion enregistrée" }
    #swagger.responses[403] = { description: "Utilisateur banni de ce salon" }
    #swagger.responses[404] = { description: "Salon introuvable" }
    #swagger.responses[409] = { description: "Déjà membre" }
  */
  ctrl.join);

router.post("/:roomId/leave",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Quitter un salon'
    #swagger.description = "Si le propriétaire quitte, la propriété est transférée au plus ancien membre restant. Si le dernier membre part, le salon est supprimé et la réponse contient deleted: true."
    #swagger.responses[200] = { description: "Départ enregistré" }
    #swagger.responses[404] = { description: "Salon introuvable" }
    #swagger.responses[409] = { description: "Non membre du salon" }
  */
  ctrl.leave);

router.post("/:roomId/kick/:userId",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Expulser ou bannir un membre'
    #swagger.description = "Réservé au propriétaire, qui ne peut pas s'expulser lui-même. Avec ban: true, l'utilisateur ne pourra plus rejoindre le salon."
    #swagger.requestBody = {
      content: { "application/json": { schema: {
        type: "object",
        properties: { ban: { type: "boolean", default: false } }
      } } }
    }
    #swagger.responses[200] = { description: "Membre retiré" }
    #swagger.responses[403] = { description: "Seul le propriétaire peut modérer" }
    #swagger.responses[404] = { description: "Salon introuvable" }
    #swagger.responses[409] = { description: "Cet utilisateur n'est pas membre" }
  */
  ctrl.kick);

router.delete("/:roomId",
  /*
    #swagger.tags = ['Rooms']
    #swagger.summary = 'Supprimer un salon'
    #swagger.description = 'Réservé au propriétaire. Les messages du salon sont supprimés en cascade.'
    #swagger.responses[200] = { description: "Salon supprimé" }
    #swagger.responses[403] = { description: "Seul le propriétaire peut supprimer" }
    #swagger.responses[404] = { description: "Salon introuvable" }
  */
  ctrl.remove);

module.exports = router;