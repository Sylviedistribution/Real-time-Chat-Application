const http = require("http");
const { io: ioClient } = require("socket.io-client");
const request = require("supertest");
const app = require("../src/app");
const initSocket = require("../src/sockets");
const Message = require("../src/models/Message");
const { createUser, createRoom, auth } = require("./helpers");

let httpServer, io, url;
const ouverts = [];

beforeAll((done) => {
  httpServer = http.createServer(app);
  io = initSocket(httpServer);
  httpServer.listen(0, () => {
    url = `http://localhost:${httpServer.address().port}`;
    done();
  });
});

afterEach(() => {
  ouverts.forEach((s) => s.close());
  ouverts.length = 0;
});

afterAll(async () => {
  io.close();
  await new Promise((resolve) => httpServer.close(resolve));
});

function connecter(token) {
  return new Promise((resolve, reject) => {
    const socket = ioClient(url, { auth: { token }, transports: ["websocket"] });
    ouverts.push(socket);
    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (err) => reject(err));
  });
}

describe("Authentification du handshake", () => {
  it("refuse une connexion sans jeton", async () => {
    await expect(connecter(undefined)).rejects.toThrow(/Authentification requise/);
  });

  it("refuse un jeton falsifié", async () => {
    await expect(connecter("jeton.invalide.xxx")).rejects.toThrow(/invalide|expirée/i);
  });

  it("accepte un jeton valide", async () => {
    const { token } = await createUser();
    const socket = await connecter(token);
    expect(socket.connected).toBe(true);
  });
});

describe("Adhésion aux canaux", () => {
  it("accepte un membre du salon", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    const socket = await connecter(token);

    const res = await socket.emitWithAck("channel:join", room._id);
    expect(res.success).toBe(true);
  });

  it("refuse un non-membre", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    const socket = await connecter(tokenB);

    const res = await socket.emitWithAck("channel:join", room._id);
    expect(res.success).toBe(false);
  });
});

describe("Diffusion des messages", () => {
  it("livre le message de A à B et le persiste", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));

    const socketA = await connecter(tokenA);
    const socketB = await connecter(tokenB);
    await socketA.emitWithAck("channel:join", room._id);
    await socketB.emitWithAck("channel:join", room._id);

    const recu = new Promise((resolve) => socketB.once("message:new", resolve));
    const ack = await socketA.emitWithAck("message:send", { channelId: room._id, content: "Bonjour B" });
    const message = await recu;

    expect(ack.success).toBe(true);
    expect(message.content).toBe("Bonjour B");
    expect(await Message.countDocuments({ room: room._id })).toBe(1);
  });

  it("refuse d'écrire dans un canal non autorisé", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    const socketB = await connecter(tokenB);

    const ack = await socketB.emitWithAck("message:send", { channelId: room._id, content: "intrusion" });
    expect(ack.success).toBe(false);
  });
});