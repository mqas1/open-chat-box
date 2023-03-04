const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

require("dotenv").config();

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: 1200000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));

app.use(routes);

const chat = "Open Chat Box";
// Run when client conencts
io.on("connection", (socket) => {
  console.log("new WS connection");
  // Welcome current user
  socket.emit("message", formatMessage(chat, "Welcome to the chat"));

  // Broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(chat, "user has join the chat")
  );

  // Listen for chatMessages of users
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", formatMessage("USER", msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(chat, "User has left the chat"));
  });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
