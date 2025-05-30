const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const TripStudent = sequelize.define("TripStudent", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  present: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = TripStudent;