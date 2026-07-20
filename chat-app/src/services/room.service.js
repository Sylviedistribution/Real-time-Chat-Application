const Room = require("../models/Room");
const ApiError = require("../utils/ApiError");

const MEMBER_FIELDS = "username avatarUrl status";

async function listRooms() {
    return Room.find({ isPrivate: false })
        .populate("owner", MEMBER_FIELDS)
        .sort({ createdAt: 1 });
}

async function createRoom(ownerId, { name, description }) {
    return Room.create({ name, description, owner: ownerId, members: [ownerId] });
}

async function getRoomById(roomId) {
    const room = await Room.findById(roomId)
        .populate("owner", MEMBER_FIELDS)
        .populate("members", MEMBER_FIELDS);
    if (!room) throw new ApiError(404, "Salon introuvable");
    return room;
}

async function joinRoom(userId, roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Salon introuvable");
    if (room.isBanned(userId)) throw new ApiError(403, "Vous êtes banni de ce salon");
    if (room.isMember(userId)) throw new ApiError(409, "Vous êtes déjà membre de ce salon");
    if (room.isPrivate) throw new ApiError(403, "Ce salon est privé, une invitation est requise");

    room.members.push(userId);
    await room.save();
    return getRoomById(roomId);
}

async function leaveRoom(userId, roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Salon introuvable");
    if (!room.isMember(userId)) throw new ApiError(409, "Vous n'êtes pas membre de ce salon");

    room.members = room.members.filter((m) => !m.equals(userId));

    // Règle de l'avenant : le dernier membre parti → suppression du salon
    if (room.members.length === 0) {
        await room.deleteOne();
        return { deleted: true };
    }
    // Transfert d'ownership au plus ancien membre restant (option b, Phase "avenant")
    if (room.isOwner(userId)) {
        room.owner = room.members[0];
    }
    await room.save();
    return getRoomById(roomId);
}

async function kickMember(ownerId, roomId, targetId, { ban = false } = {}) {
    const room = await Room.findById(roomId);
    if (!room) throw new ApiError(404, "Salon introuvable");
    if (!room.isOwner(ownerId)) throw new ApiError(403, "Seul le propriétaire peut modérer ce salon");
    if (ownerId === targetId.toString()) throw new ApiError(400, "Le propriétaire ne peut pas s'expulser lui-même");
    if (!room.isMember(targetId)) throw new ApiError(409, "Cet utilisateur n'est pas membre du salon");

    room.members = room.members.filter((m) => !m.equals(targetId));
    if (ban) room.bannedUsers.push(targetId);   // FR-17 : kick + ban
    await room.save();
    return getRoomById(roomId);
}

module.exports = { listRooms, createRoom, getRoomById, joinRoom, leaveRoom, kickMember };