const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "The user name is required"],
      unique: true,
      trim: true,
      minlength: [3, "3 caractères minimum"],
      maxlength: [30, "30 caractères maximum"],
    },
    email: {
      type: String,
      required: [true, "The email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: [8, "8 characters minimum"],
      select: false, // ⚠ never returned by default in queries
    },
    avatarUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // ajoute createdAt et updatedAt automatiquement
);

// Hook : hasher le mot de passe avant chaque sauvegarde s'il a changé
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode d'instance : comparer un mot de passe candidat au hash
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);