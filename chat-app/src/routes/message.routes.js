// message.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/message.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { getMessagesRules, createMessageRules } = require("../validators/message.validators");

router.use(requireAuth);          // ← protège tout le routeur

router.get("/:channelId", getMessagesRules, validate, ctrl.getMessages);
router.post("/:channelId", createMessageRules, validate, ctrl.createMessage);

module.exports = router;