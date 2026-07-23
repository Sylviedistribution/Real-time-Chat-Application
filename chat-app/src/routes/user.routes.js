const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { updateMeRules, searchRules } = require("../validators/user.validators");

router.use(requireAuth);

router.get("/search", searchRules, validate, ctrl.search);
router.patch("/me", updateMeRules, validate, ctrl.updateMe);

module.exports = router;