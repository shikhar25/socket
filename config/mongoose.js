const mongoose = require("mongoose");
const db = mongoose.connection;
console.log("????????????")

mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app', 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(">>>>>>>>>>>>>>>")
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected Successfully Mongoose Connection...");
});