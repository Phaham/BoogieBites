const mongoose = require("mongoose");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});


const io = require('socket.io')(server)
const Msg = require('./models/messagesModel');

io.on('connection', (socket) => {
  Msg.find().then(result => {
    socket.emit('output-messages', result)
  })

  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });
  socket.on('chatmessage', msg => {
    const message = new Msg({
      msg: msg.message,
      name: msg.name,
      photo: msg.photo
    });
    // message.save().then(() => {
    //   // io.emit('message', msg)
    //   socket.broadcast.emit('chatmessage', msg)
    message.save().then(savedMessage => {
      const messageWithUser = {
        msg: savedMessage.msg,
        name: savedMessage.name,
        photo: savedMessage.photo
      };

      socket.broadcast.emit('chatmessage', messageWithUser);
    })
  })
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
