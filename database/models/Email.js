const { DataTypes } = require('sequelize');
const sequelize = require('../connectDB/connectDB'); // Adjust the path based on your project structure

const Email = sequelize.define('Email', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeSent: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Add more attributes as needed
});

module.exports = Email;