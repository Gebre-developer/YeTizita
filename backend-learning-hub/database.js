const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "ethiopian_learning_hub",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: process.env.DB_HOST
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
            // Force the TLS layer to accept the connection protocol string
            minVersion: "TLSv1.2",
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
