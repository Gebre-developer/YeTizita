const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      // ALIGNED: Swapped studentId to userId to match your index.js routes perfectly
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedLessons: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "courseId"], // Prevents duplicate enrollments securely
      },
    ],
  },
);

module.exports = Enrollment;
