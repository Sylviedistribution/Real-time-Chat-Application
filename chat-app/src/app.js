const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { globalLimiter } = require("./middlewares/rateLimit.middleware");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const routes = require("./routes");   // le sommaire : routes/index.js

const app = express();

// --- Middlewares globaux (l'ordre EST significatif) ---
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(globalLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

// --- Route de santé (infrastructure, hors sommaire) ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "ThotTalk API", uptime: process.uptime() });
});

// --- Toutes les routes métier, via le sommaire ---
app.use("/api", routes);
app.use((req, res, next) =>
  req.path.startsWith("/socket.io") ? next() : globalLimiter(req, res, next)
);
// --- Gestion d'erreurs : TOUJOURS en dernier ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;