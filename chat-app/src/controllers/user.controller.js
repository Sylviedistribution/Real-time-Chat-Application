const userService = require("../services/user.service");

async function updateMe(req, res, next) {
  try {
    const user = await userService.updateMe(req.user._id, req.body);
    res.json({ success: true, user });
  } catch (err) { next(err); }
}

async function search(req, res, next) {
  try {
    const users = await userService.searchUsers(req.user._id, req.query.q);
    res.json({ success: true, users });
  } catch (err) { next(err); }
}

module.exports = { updateMe, search };