const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { globalLimiter, authLimiter } = require("./middlewares/rateLimit.middleware");
const env = require("./config/env");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();

// --- Middlewares globaux (l'ordre EST significatif) ---
app.use(helmet());                                    // en-têtes de sécurité
app.use(cors({ origin: env.clientUrl, credentials: true })); // seul notre front est admis
app.use(globalLimiter); 
app.use(express.json({ limit: "1mb" }));              // parsing JSON borné
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined")); // logs HTTP

// --- Route de santé ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "ThotTalk API", uptime: process.uptime() });
});

// --- Les routes métier se monteront ici (Lot B2+) ---

app.use("/api/auth", authLimiter, authRoutes);
// --- Gestion d'erreurs : TOUJOURS en dernier ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;