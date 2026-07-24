const router = require("express").Router();
const { register, login, me } = require("../controllers/auth.controller");
const { registerRules, loginRules } = require("../validators/auth.validators");
const validate = require("../middlewares/validate.middleware");
const requireAuth = require("../middlewares/auth.middleware");

router.post("/register",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Créer un compte'
    #swagger.description = 'Inscrit un nouvel utilisateur et renvoie immédiatement un jeton de session. Route publique.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 30, example: "awa" },
          email: { type: "string", format: "email", example: "awa@thottalk.app" },
          password: { type: "string", minLength: 8, example: "sagesse2026" }
        }
      } } }
    }
    #swagger.responses[201] = { description: "Compte créé, jeton renvoyé" }
    #swagger.responses[400] = { description: "Données invalides" }
    #swagger.responses[409] = { description: "Email ou nom d'utilisateur déjà utilisé" }
  */
  registerRules, validate, register);

router.post("/login",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Se connecter'
    #swagger.description = 'Vérifie les identifiants et renvoie un jeton. La réponse est identique que l\'email soit inconnu ou le mot de passe incorrect, pour ne pas révéler quels emails sont enregistrés.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: { "application/json": { schema: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "awa@thottalk.app" },
          password: { type: "string", example: "sagesse2026" }
        }
      } } }
    }
    #swagger.responses[200] = { description: "Connexion réussie, jeton renvoyé" }
    #swagger.responses[400] = { description: "Données invalides" }
    #swagger.responses[401] = { description: "Identifiants invalides" }
  */
  loginRules, validate, login);

router.get("/me",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = "Récupérer l'utilisateur courant"
    #swagger.description = 'Utilisée par le client au démarrage pour restaurer la session à partir du jeton conservé localement.'
    #swagger.responses[200] = { description: "Utilisateur authentifié" }
    #swagger.responses[401] = { description: "Jeton absent, invalide ou expiré" }
  */
  requireAuth, me);

module.exports = router;