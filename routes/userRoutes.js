const express = require("express");
const { registerUser, loginUser, allUsers } = require("../controllers/user");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/register").post(registerUser)
router.post("/login", loginUser)
router.get("/users", protect, allUsers)

module.exports = router;