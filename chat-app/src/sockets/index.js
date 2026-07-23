const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const registerChatHandlers = require("./chat.handlers");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  // Middleware de handshake : le requireAuth du monde socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentification requise"));

      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.userId);
      if (!user) return next(new Error("Utilisateur introuvable"));

      socket.user = user;          // équivalent de req.user
      next();
    } catch {
      next(new Error("Session invalide ou expirée"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ socket connecté : ${socket.user.username} (${socket.id})`);
    registerChatHandlers(io, socket);
    socket.on("disconnect", (reason) => {
      console.log(`⚡ socket parti : ${socket.user.username} (${reason})`);
    });
  });

  return io;
}

module.exports = initSocket;