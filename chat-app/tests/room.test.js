const request = require("supertest");
const app = require("../src/app");
const Room = require("../src/models/Room");
const Message = require("../src/models/Message");
const { createUser, createRoom, auth } = require("./helpers");

describe("Création et accès", () => {
  it("exige une authentification", async () => {
    const res = await request(app).get("/api/rooms");
    expect(res.status).toBe(401);
  });

  it("rend le créateur propriétaire et premier membre", async () => {
    const { user, token } = await createUser();
    const room = await createRoom(token);
    expect(room.owner._id).toBe(user._id);
    expect(room.members).toHaveLength(1);
    expect(room.members[0]._id).toBe(user._id);
  });

  it("renvoie les membres peuplés, pas des identifiants bruts", async () => {
    const { token } = await createUser();
    await createRoom(token);
    const res = await request(app).get("/api/rooms").set(...auth(token));
    expect(res.body.rooms[0].members[0].username).toBeDefined();
  });

  it("refuse un nom de salon déjà pris", async () => {
    const { token } = await createUser();
    await createRoom(token, { name: "general" });
    const res = await request(app).post("/api/rooms").set(...auth(token)).send({ name: "general" });
    expect(res.status).toBe(409);
  });
});

describe("Adhésion", () => {
  it("permet de rejoindre un salon public", async () => {
    const { token: tokenA } = await createUser();
    const { user: userB, token: tokenB } = await createUser();
    const room = await createRoom(tokenA);

    const res = await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));
    expect(res.status).toBe(200);
    expect(res.body.room.members.map((m) => m._id)).toContain(userB._id);
  });

  it("refuse une seconde adhésion", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);

    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));
    const res = await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));
    expect(res.status).toBe(409);
  });
});

describe("Modération", () => {
  it("interdit à un non-propriétaire d'expulser", async () => {
    const { token: tokenA, user: userA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));

    const res = await request(app)
      .post(`/api/rooms/${room._id}/kick/${userA._id}`).set(...auth(tokenB));
    expect(res.status).toBe(403);
  });

  it("expulse un membre sans le bannir", async () => {
    const { token: tokenA } = await createUser();
    const { user: userB, token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));

    await request(app).post(`/api/rooms/${room._id}/kick/${userB._id}`)
      .set(...auth(tokenA)).send({ ban: false });

    const retour = await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));
    expect(retour.status).toBe(200);
  });

  it("empêche un banni de revenir", async () => {
    const { token: tokenA } = await createUser();
    const { user: userB, token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));

    await request(app).post(`/api/rooms/${room._id}/kick/${userB._id}`)
      .set(...auth(tokenA)).send({ ban: true });

    const retour = await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));
    expect(retour.status).toBe(403);
  });
});

describe("Départ et suppression", () => {
  it("transfère la propriété au plus ancien membre restant", async () => {
    const { token: tokenA } = await createUser();
    const { user: userB, token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));

    await request(app).post(`/api/rooms/${room._id}/leave`).set(...auth(tokenA));

    const apres = await Room.findById(room._id);
    expect(apres.owner.toString()).toBe(userB._id);
  });

  it("supprime le salon quand le dernier membre part", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    await request(app).post(`/api/rooms/${room._id}/leave`).set(...auth(token));
    expect(await Room.findById(room._id)).toBeNull();
  });

  it("interdit la suppression à un non-propriétaire", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);
    await request(app).post(`/api/rooms/${room._id}/join`).set(...auth(tokenB));

    const res = await request(app).delete(`/api/rooms/${room._id}`).set(...auth(tokenB));
    expect(res.status).toBe(403);
  });

  it("supprime les messages en cascade", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    await request(app).post(`/api/messages/${room._id}`).set(...auth(token)).send({ content: "hello" });

    await request(app).delete(`/api/rooms/${room._id}`).set(...auth(token));

    expect(await Message.countDocuments({ room: room._id })).toBe(0);
  });
});