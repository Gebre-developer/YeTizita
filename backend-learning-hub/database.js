const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.error(
    "❌ CRITICAL EXCEPTION: DATABASE_URL variable is missing from environment context.",
  );
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
