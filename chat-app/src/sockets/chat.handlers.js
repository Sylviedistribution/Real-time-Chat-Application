const messageService = require("../services/message.service");
const EVENTS = require("./events");

module.exports = function registerChatHandlers(io, socket) {
  // Rejoindre le canal affiché à l'écran (room Socket.IO = canal ThotTalk)
  socket.on(EVENTS.CHANNEL_JOIN, async (channelId, ack) => {
    try {
      await messageService.assertCanAccess(socket.user._id, channelId);
      socket.join(channelId);
      ack?.({ success: true });
    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });

  socket.on(EVENTS.CHANNEL_LEAVE, (channelId) => {
    socket.leave(channelId);
  });

  // Envoi d'un message : persistance PUIS diffusion
  socket.on(EVENTS.MESSAGE_SEND, async ({ channelId, content }, ack) => {
    try {
      if (typeof content !== "string" || !content.trim() || content.length > 2000) {
        return ack?.({ success: false, message: "Message invalide" });
      }
      const message = await messageService.createMessage(
        socket.user._id, channelId, content.trim()
      );
      io.to(channelId).emit(EVENTS.MESSAGE_NEW, message);   // diffusion au canal
      ack?.({ success: true, message });                     // réponse privée à l'émetteur
    } catch (err) {
      ack?.({ success: false, message: err.message });
    }
  });
};