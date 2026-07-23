const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const { createUser, auth } = require("./helpers");

describe("POST /api/auth/register", () => {
  it("crée un compte et renvoie un jeton", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "awa", email: "awa@thottalk.test", password: "sagesse2026",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe("awa");
  });

  it("ne renvoie jamais le mot de passe", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "moussa", email: "moussa@thottalk.test", password: "sagesse2026",
    });
    expect(res.body.user.password).toBeUndefined();
  });

  it("hashe le mot de passe avant de le stocker", async () => {
    await request(app).post("/api/auth/register").send({
      username: "binta", email: "binta@thottalk.test", password: "sagesse2026",
    });
    const stored = await User.findOne({ email: "binta@thottalk.test" }).select("+password");
    expect(stored.password).not.toBe("sagesse2026");
    expect(stored.password).toMatch(/^\$2[aby]\$/);
  });

  it("refuse un email déjà utilisé", async () => {
    await createUser({ email: "doublon@thottalk.test" });
    const res = await request(app).post("/api/auth/register").send({
      username: "autre", email: "doublon@thottalk.test", password: "sagesse2026",
    });
    expect(res.status).toBe(409);
  });

  it("refuse des données invalides", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "ab", email: "pas-un-email", password: "123",
    });
    expect(res.status).toBe(400);
    expect(res.body.details.length).toBeGreaterThan(0);
  });
});

describe("POST /api/auth/login", () => {
  it("connecte avec les bons identifiants", async () => {
    const { user, password } = await createUser();
    const res = await request(app).post("/api/auth/login").send({ email: user.email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("ne révèle pas si l'email existe", async () => {
    const { user } = await createUser();
    const mauvaisMdp = await request(app).post("/api/auth/login")
      .send({ email: user.email, password: "mauvais_mot_de_passe" });
    const emailInconnu = await request(app).post("/api/auth/login")
      .send({ email: "inconnu@thottalk.test", password: "sagesse2026" });

    expect(mauvaisMdp.status).toBe(401);
    expect(emailInconnu.status).toBe(401);
    expect(mauvaisMdp.body.message).toBe(emailInconnu.body.message);
  });
});

describe("GET /api/auth/me", () => {
  it("refuse sans jeton", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("refuse un jeton falsifié", async () => {
    const res = await request(app).get("/api/auth/me").set(...auth("jeton.invalide.xxx"));
    expect(res.status).toBe(401);
  });

  it("renvoie l'utilisateur courant avec un jeton valide", async () => {
    const { user, token } = await createUser();
    const res = await request(app).get("/api/auth/me").set(...auth(token));
    expect(res.status).toBe(200);
    expect(res.body.user._id).toBe(user._id);
  });
});