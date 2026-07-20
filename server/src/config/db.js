const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  try {
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connexion MongoDB échouée : ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;