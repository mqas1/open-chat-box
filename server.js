const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

require("dotenv").config();

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SESS_SECRET || "Super secret secret",
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

io.engine.use((session(sess)));

// Run when client conencts
io.on("connection", (socket) => {
  const sessionId = socket.request.session.id;

  socket.join(sessionId);
  console.log("new WS connection");
  console.log(socket.request.session);
  // Welcome current user
  socket.emit("server", `Welcome to Open Chat Box, ${socket.request.session.user_name}! Click on any topic to start chatting!`);

  // Broadcast when a user connects
  socket.broadcast.emit("server", `${socket.request.session.user_name} has joined the chat`);

  // Listen for chatMessages of users
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", msg);
  });

  socket.on("chatTopic", (topic) => {
    console.log(topic);
    io.emit("topic", topic);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("server", `${socket.request.session.user_name} has left the chat`);
  });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
