const router = require("express").Router();
const ctrl = require("../controllers/conversation.controller");
const requireAuth = require("../middlewares/auth.middleware");

router.use(requireAuth);

router.get("/",
  /*
    #swagger.tags = ['Conversations']
    #swagger.summary = 'Lister mes conversations'
    #swagger.description = 'Triées par activité récente, la plus récemment active en premier.'
    #swagger.responses[200] = { description: "Liste des conversations" }
    #swagger.responses[401] = { description: "Non authentifié" }
  */
  ctrl.listMine);

router.post("/with/:userId",
  /*
    #swagger.tags = ['Conversations']
    #swagger.summary = 'Ouvrir une conversation avec un utilisateur'
    #swagger.description = 'Renvoie la conversation existante ou la crée. Deux appels successifs renvoient le même identifiant grâce à une clé canonique en base.'
    #swagger.responses[201] = { description: "Conversation ouverte" }
    #swagger.responses[400] = { description: "Conversation avec soi-même impossible" }
    #swagger.responses[404] = { description: "Utilisateur introuvable" }
  */
  ctrl.getOrCreate);

module.exports = router;