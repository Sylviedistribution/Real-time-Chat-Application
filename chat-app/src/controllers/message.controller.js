const messageService = require("../services/message.service");

async function getMessages(req, res, next) {
  try {
    const { page, limit } = req.query;   // déjà validés et convertis par toInt
    const result = await messageService.getMessages(req.user._id, req.params.channelId, { page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function createMessage(req, res, next) {
  try {
    const message = await messageService.createMessage(
      req.user._id, req.params.channelId, req.body.content
    );
    res.status(201).json({ success: true, message });
  } catch (err) { next(err); }
}

module.exports = { getMessages, createMessage };