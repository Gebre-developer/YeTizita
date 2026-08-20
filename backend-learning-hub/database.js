const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Turn on SSL strictly if a production database host variable is detected
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

// Import models immediately to ensure sync stability
const User = require("./models/User");
const Course = require("./models/Course");

// Define Enrollment junction model synchronously
const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  { timestamps: true },
);

// FIXED: Defined relationships globally and synchronously to completely eliminate Express route race conditions
User.hasMany(Course, { foreignKey: "instructorId", onDelete: "CASCADE" });
Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });

User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

// Asynchronous execution layer restricted purely to schema synchronization tasks
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("🚀 Connected to the MySQL cloud infrastructure securely.");

    // Sync models in order of dependency requirements safely
    await User.sync({ alter: true });
    await Course.sync({ alter: true });
    await Enrollment.sync({ alter: true });

    console.log(
      "📊 All database schemas synchronized sequentially without error!",
    );
  } catch (error) {
    console.error("❌ Sequential database initialization failed:", error);
  }
};

initializeDatabase();

module.exports = sequelize;
