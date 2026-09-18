const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Exam = sequelize.define(
  "Exam",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Exams",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // Matches your SQL script which only has created_at
  },
);

module.exports = Exam;
