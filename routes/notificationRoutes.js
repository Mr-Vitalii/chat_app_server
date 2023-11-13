const express = require("express");
const {
    allNotifications,
    sendNotification,
    deleteNotification,
    deleteAllNotificationFromChat
} = require("../controllers/notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.route("/").post(protect, sendNotification);
router.route("/").get(protect, allNotifications);
router.route("/:notificationId").delete(protect, deleteNotification);
router.route("/chat/:chatId").delete(protect, deleteAllNotificationFromChat);


module.exports = router;