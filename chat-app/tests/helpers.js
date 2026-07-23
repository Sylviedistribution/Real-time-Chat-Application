const request = require("supertest");
const app = require("../src/app");

let counter = 0;

async function createUser(overrides = {}) {
  counter += 1;
  const payload = {
    username: `user${counter}`,
    email: `user${counter}@thottalk.test`,
    password: "sagesse2026",
    ...overrides,
  };
  const res = await request(app).post("/api/auth/register").send(payload);
  return { user: res.body.user, token: res.body.token, password: payload.password };
}

async function createRoom(token, overrides = {}) {
  counter += 1;
  const res = await request(app)
    .post("/api/rooms")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: `salon${counter}`, description: "Salon de test", ...overrides });
  return res.body.room;
}

const auth = (token) => ["Authorization", `Bearer ${token}`];

module.exports = { createUser, createRoom, auth };