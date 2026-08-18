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
      defaultValue: 0.0, // 0.00 means a free course
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Programming", // Helps handle filtering categories dynamically
    },
    gradeLevel: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures courses match the correct Ethiopian school grade (9-12)
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true, // Holds the path to uploaded PDFs/ZIPs once teachers submit them
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Tracks exactly which educator deployed the module
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Course;
