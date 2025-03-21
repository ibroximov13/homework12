const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Category = db.define("categories", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    timestamps: false,
});

module.exports = Category;