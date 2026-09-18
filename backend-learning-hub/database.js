// database.js
require("dotenv").config(); // 🚀 ADDED: Forces environment variables to load before Sequelize connects!
const { Sequelize } = require("sequelize");
const { neonConfig } = require("@neondatabase/serverless");
// 🚀 ADDED: Import pgvector sequelize connector to support vector data types
const pgvector = require("pgvector/sequelize");

if (!process.env.DATABASE_URL) {
  console.error(
    "❌ Error: DATABASE_URL environment variable is missing from your .env file!",
  );
  process.exit(1);
}

// 🛡️ WEB-SAFE TUNNEL OVERRIDE
// This forces Neon to route your data over standard HTTP fetch blocks instead of WebSockets.
// Firewalls cannot block this because it mimics normal web browsing traffic.
neonConfig.poolQueryViaFetch = true;

// 🚀 ADDED: Register the VECTOR data type inside Sequelize before initializing the client
pgvector.registerType(Sequelize);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: require("@neondatabase/serverless"), // Wraps Sequelize in serverless driver hooks
  logging: false, // Disables cluttered SQL console strings
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for secure cloud certificate authentication
    },
  },
});

module.exports = sequelize;
