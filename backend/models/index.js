const User = require("./User");
const Trip = require("./Trip");
const TripStudent = require("./TripStudent");
const Payment = require("./Payment");

// Relacionamentos
Trip.belongsTo(User, { foreignKey: "driverId", as: "driver" });
User.hasMany(Trip, { foreignKey: "driverId", as: "trips" });

Trip.belongsToMany(User, {
  through: TripStudent,
  as: "students",
  foreignKey: "tripId",
  otherKey: "studentId",
});
User.belongsToMany(Trip, {
  through: TripStudent,
  as: "tripsAsStudent",
  foreignKey: "studentId",
  otherKey: "tripId",
});

Payment.belongsTo(User, { foreignKey: "userId", as: "user" });
Payment.belongsTo(Trip, { foreignKey: "tripId", as: "trip" });

module.exports = { User, Trip, TripStudent, Payment };