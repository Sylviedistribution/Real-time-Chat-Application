const { io } = require("socket.io-client");

const TOKEN = "COLLE_UN_TOKEN_VALIDE_ICI";       // via un login Insomnia
const CHANNEL = "COLLE_UN_ID_DE_SALON_ICI";      // un salon dont tu es membre

const socket = io("http://localhost:5000", { auth: { token: TOKEN } });

socket.on("connect", () => {
  console.log("✅ connecté :", socket.id);
  socket.emit("channel:join", CHANNEL, (res) => {
    console.log("join :", res);
    socket.emit("message:send", { channelId: CHANNEL, content: "Hello depuis le script !" },
      (ack) => console.log("ack :", ack));
  });
});
socket.on("message:new", (m) => console.log("📨 message:new :", m.content, "de", m.sender.username));
socket.on("connect_error", (err) => console.log("❌ refusé :", err.message));