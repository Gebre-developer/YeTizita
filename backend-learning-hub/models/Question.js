const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Exam = require("./Exam");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    exam_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Exam,
        key: "id",
      },
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSONB, // Stores options array: ["Option A", "Option B", ...]
      allowNull: false,
    },
    correct_answer: {
      type: DataTypes.INTEGER, // Zero-based index of correct option (e.g., 0 for A, 1 for B)
      allowNull: false,
    },
    embedding: {
      type: DataTypes.VECTOR(1536), // 🚀 Uses the pgvector data type registered in database.js
      allowNull: true,
    },
  },
  {
    tableName: "Questions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Define Relationships
Exam.hasMany(Question, { foreignKey: "exam_id", onDelete: "CASCADE" });
Question.belongsTo(Exam, { foreignKey: "exam_id" });

module.exports = Question;
