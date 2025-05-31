const User = require('./User');
const Trip = require('./Trip');
const Payment = require('./Payment');
const Student = require('./Student');
const TripStudent = require('./TripStudent');

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

// Relacionamento entre Student e User (responsável)
Student.belongsTo(User, { foreignKey: 'responsibleId', as: 'responsible' });
User.hasMany(Student, { foreignKey: 'responsibleId', as: 'students' });

module.exports = { User, Trip, Payment, Student };