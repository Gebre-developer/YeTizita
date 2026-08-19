const { Sequelize } = require("sequelize");
require("dotenv").config();

// Determine if we are running in the cloud or locally
const isProduction = !!process.env.DB_HOST;

const sequelize = new Sequelize(
  process.env.DB_NAME || "ethiopian_learning_hub",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  },
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "🚀 Connected to the MySQL database target module successfully!",
    );
  } catch (error) {
    console.error("❌ Unable to connect to the database environment:", error);
  }
};

testConnection();

module.exports = sequelize;
