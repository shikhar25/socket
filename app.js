require("dotenv").config();

// var mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app');

const app = require("express")();

const http = require("http").Server(app);

const { log } = require("console");
const userRoute = require("./routes/userRoute");
const { disconnect } = require("process");
require("./config/mongoose");

const User = require("./models/userModels");

const Chat = require("./models/chatModels");

app.use("/", userRoute);

const io = require("socket.io")(http);

var usp = io.of("/user-namespace");

usp.on("connection", async function (socket) {
  console.log("User Connected");

  var userId = socket.handshake.auth.token;

  await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: "1" } });

  // user broadcast online status

  socket.broadcast.emit("getOnlineUser", { user_id: userId });

  socket.on("disconnect", async function () {
    console.log("User Disconnected");
    await User.findByIdAndUpdate({ _id: userId }, { $set: { is_online: "0" } });

    // user broadcast offline status

    socket.broadcast.emit("getOfflineUser", { user_id: userId });
  });

  //******************************Load New Chats****************************//

  socket.on("newChat", function (data) {
    socket.broadcast.emit("loadNewChat", data);
  });

  //***********************Load Old Chats************************//

  socket.on("existChats", async function (data) {
    var chats = await Chat.find({
      $or: [
        { sender_id: data.sender_id, receiver_id: data.receiver_id },
        { sender_id: data.receiver_id, receiver_id: data.sender_id },
      ],
    });

    socket.emit("loadChats", { chats: chats });
  });
  
});

http.listen(3000, function () {
  console.log("Server is Running");
});
