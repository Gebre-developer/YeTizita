const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Programming",
    },
    gradeLevel: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures courses align with the correct Ethiopian school grade (9-12)
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Course;
