const { Sequelize } = require("sequelize");

// We are putting the values directly here to bypass dotenvx caching issues!
const sequelize = new Sequelize(
  "ethiopian_learning_hub", // Database Name
  "root", // Username
  "", // Password (Leave completely blank inside quotes)
  {
    host: "127.0.0.1", // Localhost IP address
    dialect: "mysql",
    logging: false, // Keeps terminal clean
  },
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the MySQL database!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

module.exports = sequelize;
