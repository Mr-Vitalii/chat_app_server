const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data")

const cors = require('cors');

const app = express();
app.use(cors());
// dotenv.config();

// const PORT = process.env.PORT;

PORT = 5000

app.get("/", (req, res) => {
    res.json("API Running!");
});

app.use("/api/chat", (req, res) => {
    console.log(req);
    res.send(chats);
});


app.use((req, res) => {
    res.status(404).json({ message: 'Not found' })
})

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

