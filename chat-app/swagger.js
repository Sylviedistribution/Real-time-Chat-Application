const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "ThotTalk API",
    version: "1.0.0",
    description:
      "API de l'application de messagerie temps réel ThotTalk.\n\n" +
      "Toutes les routes exigent un jeton JWT dans l'en-tête Authorization " +
      "(`Bearer <token>`), sauf /auth/register et /auth/login. " +
      "Utilisez le bouton « Authorize » pour le renseigner.\n\n" +
      "En complément de cette API REST, une connexion Socket.IO assure la " +
      "diffusion instantanée des messages. Les deux canaux partagent la même " +
      "couche de services, donc les mêmes règles d'autorisation.",
  },
  servers: [{ url: "http://localhost:5000/api", description: "Développement local" }],
  tags: [
    { name: "Auth", description: "Inscription, connexion et session" },
    { name: "Users", description: "Profil et recherche" },
    { name: "Rooms", description: "Salons publics" },
    { name: "Conversations", description: "Échanges privés" },
    { name: "Messages", description: "Historique et envoi" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const endpoints = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpoints, doc);