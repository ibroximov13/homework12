const {db} = require("../config/db");
require("./associations");

const User = require("./user.model");
const Product = require("./product.model");
const Comment = require("./comment.model");
const Region = require("./region.model");
const Order = require("./order.model");
const OrderItem = require("./orderItem.model");
const Category = require("./category.model");

module.exports = {
    db,
    User, 
    Product,
    Comment,
    Region,
    Order,
    OrderItem,
    Category
}