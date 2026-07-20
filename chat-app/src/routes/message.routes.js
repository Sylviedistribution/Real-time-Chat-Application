// message.routes.js
const { getMessagesRules, createMessageRules } = require("../validators/message.validators");

router.get("/:channelId", getMessagesRules, validate, ctrl.getMessages);
router.post("/:channelId", createMessageRules, validate, ctrl.createMessage);