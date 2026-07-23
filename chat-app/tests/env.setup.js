process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "secret_de_test_uniquement_ne_jamais_utiliser_en_production_0123456789";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/thottalk-test";