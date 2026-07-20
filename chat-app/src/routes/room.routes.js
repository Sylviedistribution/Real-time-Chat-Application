const router = require("express").Router();
const ctrl = require("../controllers/room.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createRoomRules } = require("../validators/room.validators");

router.use(requireAuth);                       // TOUT le routeur est protégé

router.get("/", ctrl.list);                    // liste des salons publics
router.post("/", createRoomRules, validate, ctrl.create);
router.get("/:roomId", ctrl.getOne);
router.post("/:roomId/join", ctrl.join);
router.post("/:roomId/leave", ctrl.leave);
router.post("/:roomId/kick/:userId", ctrl.kick);   // body optionnel { ban: true }
module.exports = router;