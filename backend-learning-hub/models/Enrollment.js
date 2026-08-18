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
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Links directly to the user who enrolled
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Links directly to the chosen course row
    },
    completedLessons: {
      type: DataTypes.JSON,
      defaultValue: [], // Stores an array of completed lesson string IDs (e.g. ["L1", "L2"])
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "courseId"], // Prevents a student from enrolling in the same course twice
      },
    ],
  },
);

module.exports = Enrollment;
