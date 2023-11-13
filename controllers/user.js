const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const { HttpError, cloudinary } = require("../helpers");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw HttpError(400, "Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw HttpError(400, "User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        throw HttpError(400, "User not found");
    }

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        throw HttpError(401, "Invalid Email or Password");
    }
});


const allUsers = asyncHandler(async (req, res) => {

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});



const updateAvatar = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    console.log(_id);

    const options = {
        folder: `chat_app/userAvatar/${_id}`,
        resource_type: "auto",
    };

    cloudinary.uploader.upload_stream(options, async (error, result) => {
        if (error) {
            throw HttpError(500, "Upload failed");
        }

        const avatarURL = result.secure_url;

        if (!avatarURL) {
            throw HttpError(500, "Upload failed");
        }
        await User.findByIdAndUpdate(_id, { pic: avatarURL });
        return res.status(200).json({ pic: avatarURL });

    }).end(req.file.buffer);

});


module.exports = {
    registerUser,
    loginUser,
    allUsers,
    updateAvatar
};