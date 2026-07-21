const User = require("../models/User");
const { toPublicUser } = require("./auth.service");

async function updateMe(userId, { username, avatarUrl }) {
  const user = await User.findById(userId);
  if (username !== undefined) user.username = username;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();   // déclenche les validations du schéma (unique, minlength…)
  return toPublicUser(user);
}

module.exports = { updateMe };