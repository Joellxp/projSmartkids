const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User");
const TripStudent = require("./TripStudent"); // Importe o model TripStudent

const Trip = sequelize.define("Trip", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false, // ID do condutor (usuário)
    references: {
      model: User,
      key: "id",
    },
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false, // Horário de início da viagem
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true, // Horário de término (pode ser nulo até finalizar)
  },
  status: {
    type: DataTypes.ENUM("active", "completed"),
    defaultValue: "active",
  },
});

module.exports = Trip;