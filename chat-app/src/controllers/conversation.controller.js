const conversationService = require("../services/conversation.service");

async function listMine(req, res, next) {
  try {
    const conversations = await conversationService.listMyConversations(req.user._id);
    res.json({ success: true, conversations });
  } catch (err) { next(err); }
}

async function getOrCreate(req, res, next) {
  try {
    const conversation = await conversationService.getOrCreateConversation(
      req.user._id, req.params.userId
    );
    res.status(201).json({ success: true, conversation });
  } catch (err) { next(err); }
}

module.exports = { listMine, getOrCreate };