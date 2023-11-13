const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Notifications = require("../models/notificationsModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


const sendNotification = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newNotification = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        participants: chatId.users
    };

    try {
        var notification = await Notifications.create(newNotification);

        notification = await notification.populate("sender", "name pic")
        notification = await notification.populate("chat")
        notification = await User.populate(notification, {
            path: "chat.users",
            select: "name pic email",
        });

        res.json(notification);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});



const allNotifications = asyncHandler(async (req, res) => {

    const { _id: owner } = req.user;

    try {
        var notifications = await Notifications.find({
            participants: {
                $elemMatch: { $eq: owner }
            }
        });

        notifications = await notifications.filter(notification => notification.sender.toString() === owner.toString())

        res.json(notifications);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);

    }
});

const deleteNotification = asyncHandler(async (req, res) => {

    const { notificationId } = req.params;

    try {
        const result = await Notifications.findOneAndRemove(notificationId);

        res.json({
            notificationId,
            message: "Delete success"
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const deleteAllNotificationFromChat = asyncHandler(async (req, res) => {

    const { chatId } = req.params;

    try {
        const notifications = await Notifications.find({ 'chat._id': chatId });

        for (const notification of notifications) {
            await notification.deleteOne();
        }

        res.json({
            message: "Deleted notifications"
        })

    } catch (error) {

        console.log("error");
        console.log(error.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }

})



module.exports = { allNotifications, sendNotification, deleteNotification, deleteAllNotificationFromChat };