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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedLessons: {
      type: DataTypes.JSON,
      defaultValue: [], // Stores completed lesson IDs directly in an array
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "courseId"], // Blocks duplicate enrollment rows securely
      },
    ],
  },
);

module.exports = Enrollment;
