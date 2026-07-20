const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The room name is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    description: { type: String, trim: true, maxlength: 200, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bannedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // FR-17
    isPrivate: { type: Boolean, default: false }, // FR-19 (Could have, champ prêt)
  },
  { timestamps: true }
);

// Instance methods : readability of services
roomSchema.methods.isMember = function (userId) {
  return this.members.some((m) => m.equals(userId));
};
roomSchema.methods.isBanned = function (userId) {
  return this.bannedUsers.some((b) => b.equals(userId));
};
roomSchema.methods.isOwner = function (userId) {
  return this.owner.equals(userId);
};

module.exports = mongoose.model("Room", roomSchema);