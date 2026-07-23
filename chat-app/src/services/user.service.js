const User = require("../models/User");
const { toPublicUser } = require("./auth.service");

async function updateMe(userId, { username, avatarUrl }) {
  const user = await User.findById(userId);
  if (username !== undefined) user.username = username;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();   // déclenche les validations du schéma (unique, minlength…)
  return toPublicUser(user);
}

async function searchUsers(currentUserId, q) {
  // Échapper les caractères spéciaux : une entrée utilisateur ne devient JAMAIS
  // une expression régulière telle quelle (injection / déni de service par regex)
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return User.find({
    _id: { $ne: currentUserId },              // on ne se cherche pas soi-même
    username: { $regex: safe, $options: "i" }, // "i" = insensible à la casse
  })
    .select("username avatarUrl status")       // jamais l'email : minimisation
    .limit(10)
    .sort({ username: 1 });
}

module.exports = { updateMe, searchUsers};