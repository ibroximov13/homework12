const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Product = db.define("products", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    star: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Product;