const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data")
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json("API Running!");
});

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes);


app.use(notFound);
app.use(errorHandler);

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message })
})

// app.use("/api/chat/:id", (req, res) => {
//     console.log(req.params.id);
//     console.log(chats);
//     chats.map((c) => console.log(c))
//     // const singleChat = chats.find((c) => c._id === req.params.id)
//     // res.send(singleChat);
//     res.json(chats);
// });


const server = app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}...`);
});

