const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      trim: true,
      maxlength: [2000, "2000 caractères maximum"],
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

// Contrainte métier du diagramme de classes : room XOR conversation
messageSchema.pre("validate", function (next) {
  const hasRoom = !!this.room;
  const hasConversation = !!this.conversation;
  if (hasRoom === hasConversation) {
    return next(
      new Error("Un message appartient soit à un salon, soit à une conversation")
    );
  }
  next();
});

// Index composés : le cœur de la performance de la pagination (FR-12)
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);