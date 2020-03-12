const router = require("express").Router();
const { registerUser, auth, refreshTokens } = require("../controllers/user");

router.post("/signup", registerUser);
router.post("/signin", auth);
router.post("/refresh", refreshTokens);

module.exports = router;
