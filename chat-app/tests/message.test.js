const request = require("supertest");
const app = require("../src/app");
const { createUser, createRoom, auth } = require("./helpers");

describe("Autorisation par canal", () => {
  it("interdit d'écrire dans un salon dont on n'est pas membre", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);

    const res = await request(app).post(`/api/messages/${room._id}`)
      .set(...auth(tokenB)).send({ content: "intrusion" });
    expect(res.status).toBe(403);
  });

  it("interdit de lire l'historique d'un salon dont on n'est pas membre", async () => {
    const { token: tokenA } = await createUser();
    const { token: tokenB } = await createUser();
    const room = await createRoom(tokenA);

    const res = await request(app).get(`/api/messages/${room._id}`).set(...auth(tokenB));
    expect(res.status).toBe(403);
  });

  it("exige une authentification", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    const res = await request(app).get(`/api/messages/${room._id}`);
    expect(res.status).toBe(401);
  });
});

describe("Envoi", () => {
  it("enregistre le message avec son expéditeur peuplé", async () => {
    const { user, token } = await createUser();
    const room = await createRoom(token);

    const res = await request(app).post(`/api/messages/${room._id}`)
      .set(...auth(token)).send({ content: "Salut !" });

    expect(res.status).toBe(201);
    expect(res.body.message.content).toBe("Salut !");
    expect(res.body.message.sender.username).toBe(user.username);
    expect(res.body.message.room).toBe(room._id);
  });

  it("refuse un contenu vide", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    const res = await request(app).post(`/api/messages/${room._id}`)
      .set(...auth(token)).send({ content: "   " });
    expect(res.status).toBe(400);
  });

  it("refuse un contenu trop long", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    const res = await request(app).post(`/api/messages/${room._id}`)
      .set(...auth(token)).send({ content: "a".repeat(2001) });
    expect(res.status).toBe(400);
  });
});

describe("Pagination de l'historique", () => {
  it("découpe en pages et signale la suite", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);

    for (let i = 1; i <= 35; i += 1) {
      await request(app).post(`/api/messages/${room._id}`)
        .set(...auth(token)).send({ content: `message ${i}` });
    }

    const page1 = await request(app).get(`/api/messages/${room._id}?page=1&limit=30`).set(...auth(token));
    expect(page1.body.messages).toHaveLength(30);
    expect(page1.body.pagination.total).toBe(35);
    expect(page1.body.pagination.hasMore).toBe(true);

    const page2 = await request(app).get(`/api/messages/${room._id}?page=2&limit=30`).set(...auth(token));
    expect(page2.body.messages).toHaveLength(5);
    expect(page2.body.pagination.hasMore).toBe(false);
  });

  it("renvoie la page 1 du plus ancien au plus récent", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    for (const contenu of ["premier", "deuxième", "troisième"]) {
      await request(app).post(`/api/messages/${room._id}`).set(...auth(token)).send({ content: contenu });
    }

    const res = await request(app).get(`/api/messages/${room._id}`).set(...auth(token));
    expect(res.body.messages.map((m) => m.content)).toEqual(["premier", "deuxième", "troisième"]);
  });

  it("refuse une page invalide", async () => {
    const { token } = await createUser();
    const room = await createRoom(token);
    const res = await request(app).get(`/api/messages/${room._id}?page=0`).set(...auth(token));
    expect(res.status).toBe(400);
  });
});