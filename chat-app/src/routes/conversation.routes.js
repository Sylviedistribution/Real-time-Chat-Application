const router = require("express").Router();
const ctrl = require("../controllers/conversation.controller");
const requireAuth = require("../middlewares/auth.middleware");

router.use(requireAuth);                       // tout le routeur est protégé

router.get("/", ctrl.listMine);                // mes conversations, triées par activité
router.post("/with/:userId", ctrl.getOrCreate);

module.exports = router;