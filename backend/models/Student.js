const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Student = sequelize.define('Student', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  responsibleId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
  // outros campos...
});

module.exports = Student;