const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: {
        validator: (arr) => arr.length === 2,
        message: "Une conversation a exactement 2 participants",
      },
    },
    // Clé canonique : les 2 ids triés puis concaténés → unicité de la paire
    participantsKey: { type: String, unique: true },
  },
  { timestamps: true }
);

// Calcul automatique de la clé canonique avant validation
conversationSchema.pre("validate", function () {
  if (this.participants?.length === 2) {
    this.participantsKey = this.participants
      .map((id) => id.toString())
      .sort()
      .join("_");
  }
});

module.exports = mongoose.model("Conversation", conversationSchema);