const express = require("express");
const { registerUser, loginUser, allUsers, updateAvatar } = require("../controllers/user");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.route("/register").post(registerUser)
router.post("/login", loginUser)
router.get("/users", protect, allUsers)
router.patch("/update_avatar", protect, upload.single("avatar"), updateAvatar);

module.exports = router;