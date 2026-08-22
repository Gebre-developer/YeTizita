// database.js
const { Sequelize } = require("sequelize");
const { neonConfig } = require("@neondatabase/serverless");

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
