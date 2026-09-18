const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Exam = require("./Exam");
const User = require("./User"); // Uses your existing User model

const UserProgress = sequelize.define(
  "UserProgress",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // References your existing table
        key: "id",
      },
    },
    exam_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Exam,
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_questions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weak_topics: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    tableName: "UserProgresses",
    timestamps: true,
    createdAt: "completed_at", // Matches completed_at column in migration script
    updatedAt: false,
  },
);

// Define Relationships
User.hasMany(UserProgress, { foreignKey: "user_id", onDelete: "CASCADE" });
UserProgress.belongsTo(User, { foreignKey: "user_id" });

Exam.hasMany(UserProgress, { foreignKey: "exam_id" });
UserProgress.belongsTo(Exam, { foreignKey: "exam_id" });

module.exports = UserProgress;
