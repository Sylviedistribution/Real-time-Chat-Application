const http = require("http");
const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");

const server = http.createServer(app);

async function start() {
  await connectDB();
  server.listen(env.port, () => {
    console.log(`🚀 ThotTalk API démarrée sur http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

start();