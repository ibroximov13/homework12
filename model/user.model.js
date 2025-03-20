const { DataTypes } = require("sequelize");
const { db } = require("../config/db.js");

const User = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "regions",
      key: "id",
    },
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("USER", "ADMIN", "SUPERADMIN", "SELLER"),
    allowNull: false,
    defaultValue: "USER",
  },
}, {
  timestamps: false,
});

module.exports =  User;