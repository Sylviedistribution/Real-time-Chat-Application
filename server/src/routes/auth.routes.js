const router = require("express").Router();
const { register, login, me } = require("../controllers/auth.controller");
const { registerRules, loginRules } = require("../validators/auth.validators");
const validate = require("../middlewares/validate.middleware");
const requireAuth = require("../middlewares/auth.middleware");

router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", requireAuth, me);

module.exports = router;