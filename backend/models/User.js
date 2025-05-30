const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const User = sequelize.define("User", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	fullName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM("admin", "common"),
		allowNull: false,
		defaultValue: "common",
	},
	photo: {
		type: DataTypes.STRING,
		allowNull: true
	},
	responsibleId: {
		type: DataTypes.INTEGER,
		allowNull: true, // Só estudantes terão esse campo preenchido
		references: {
			model: "Users",
			key: "id"
		}
	}
});

const Trip = require("./Trip");
const TripStudent = require("./TripStudent");

module.exports = User;