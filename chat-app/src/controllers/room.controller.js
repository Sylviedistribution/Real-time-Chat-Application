const roomService = require("../services/room.service");

async function list(req, res, next) {
  try {
    const rooms = await roomService.listRooms();
    res.json({ success: true, rooms });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const room = await roomService.createRoom(req.user._id, req.body);
    res.status(201).json({ success: true, room });
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const room = await roomService.getRoomById(req.params.roomId);
    res.json({ success: true, room });
  } catch (err) { next(err); }
}

async function join(req, res, next) {
  try {
    const room = await roomService.joinRoom(req.user._id, req.params.roomId);
    res.json({ success: true, room });
  } catch (err) { next(err); }
}

async function leave(req, res, next) {
  try {
    const result = await roomService.leaveRoom(req.user._id, req.params.roomId);
    res.json({ success: true, ...(result.deleted ? { deleted: true } : { room: result }) });
  } catch (err) { next(err); }
}

async function kick(req, res, next) {
  try {
    const room = await roomService.kickMember(
      req.user._id, req.params.roomId, req.params.userId,
      { ban: Boolean(req.body?.ban) }
    );
    res.json({ success: true, room });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await roomService.deleteRoom(req.user._id, req.params.roomId);
    res.json({ success: true, deleted: true });
  } catch (err) { next(err); }
}

module.exports = { list, create, getOne, join, leave, kick, remove };