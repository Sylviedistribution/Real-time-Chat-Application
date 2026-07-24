# --- Étape 1 : dépendances de production uniquement ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# --- Étape 2 : image finale ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY swagger-output.json ./
COPY src ./src

# Utilisateur non privilégié : un processus compromis n'est pas root
RUN addgroup -S thot && adduser -S thot -G thot && chown -R thot:thot /app
USER thot

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "src/server.js"]