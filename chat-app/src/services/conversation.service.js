const Conversation = require("../models/Conversation");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const MEMBER_FIELDS = "username avatarUrl status";

async function listMyConversations(userId) {
  return Conversation.find({ participants: userId })
    .populate("participants", MEMBER_FIELDS)
    .sort({ updatedAt: -1 });
}

async function getOrCreateConversation(userId, otherUserId) {
  if (userId.toString() === otherUserId) {
    throw new ApiError(400, "Impossible de créer une conversation avec soi-même");
  }
  
  const other = await User.findById(otherUserId);
  if (!other) throw new ApiError(404, "Utilisateur introuvable");

  const key = [userId.toString(), otherUserId].sort().join("_");
  let conversation = await Conversation.findOne({ participantsKey: key });
  if (!conversation) {
    conversation = await Conversation.create({ participants: [userId, otherUserId] });
  }
  return conversation.populate("participants", MEMBER_FIELDS);
}

module.exports = { listMyConversations, getOrCreateConversation };