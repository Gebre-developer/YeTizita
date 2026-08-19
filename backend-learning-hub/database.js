const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

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

// Define relations step-by-step to prevent race conditions
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("🚀 Connected to the MySQL cloud infrastructure.");

    // Import models explicitly inside the sync runner lifecycle
    const User = require("./models/User");
    const Course = require("./models/Course");

    // Define Enrollment junction model dynamically
    const Enrollment = sequelize.define(
      "Enrollment",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      },
      { timestamps: true },
    );

    // 1. First, sync the Parent User Table independently
    await User.sync({ alter: true });

    // 2. Next, define the relationships layout safely
    User.hasMany(Course, { foreignKey: "instructorId", onDelete: "CASCADE" });
    Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });

    User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
    Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

    // 3. Finally, sync Courses and Enrollment after Parent structures exist
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
