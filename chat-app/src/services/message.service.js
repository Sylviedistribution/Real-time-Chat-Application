const Message = require("../models/Message");
const Room = require("../models/Room");
const Conversation = require("../models/Conversation");
const ApiError = require("../utils/ApiError");

const SENDER_FIELDS = "username avatarUrl status";

// Garde partagée : le demandeur a-t-il accès à ce canal ?
async function assertCanAccess(userId, channelId) {
  const room = await Room.findById(channelId);
  if (room) {
    if (!room.isMember(userId)) throw new ApiError(403, "Vous n'êtes pas membre de ce salon");
    return { room };
  }
  const conversation = await Conversation.findById(channelId);
  if (conversation) {
    const isParticipant = conversation.participants.some((p) => p.equals(userId));
    if (!isParticipant) throw new ApiError(403, "Vous ne participez pas à cette conversation");
    return { conversation };
  }
  throw new ApiError(404, "Canal introuvable");
}

async function getMessages(userId, channelId, { page = 1, limit = 30 } = {}) {
  const channel = await assertCanAccess(userId, channelId);
  const filter = channel.room ? { room: channelId } : { conversation: channelId };

  const [items, total] = await Promise.all([
    Message.find(filter)
      .populate("sender", SENDER_FIELDS)
      .sort({ createdAt: -1 })          // l'index composé travaille ici
      .skip((page - 1) * limit)
      .limit(limit),
    Message.countDocuments(filter),
  ]);

  return {
    messages: items.reverse(),          // renvoyés du plus ancien au plus récent
    pagination: { page, limit, total, hasMore: page * limit < total },
  };
}

async function createMessage(userId, channelId, content) {
  const channel = await assertCanAccess(userId, channelId);
  const message = await Message.create({
    sender: userId,
    content,
    ...(channel.room ? { room: channelId } : { conversation: channelId }),
  });
  if (channel.conversation) {
    channel.conversation.updatedAt = new Date();   // fait remonter la conversation
    await channel.conversation.save();
  }
  return message.populate("sender", SENDER_FIELDS);
}

module.exports = { getMessages, createMessage, assertCanAccess };