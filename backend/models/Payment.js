const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User");
const Trip = require("./Trip");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Trips",
      key: "id",
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Payment;