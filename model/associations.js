const Category = require("./category.model");
const Comment = require("./comment.model");
const Order = require("./order.model");
const OrderItem = require("./orderItem.model");
const Product = require("./product.model");
const Region = require("./region.model");

const User = require("./user.model");

Region.hasMany(User, {foreignKey: "region_id"});
User.belongsTo(Region, {foreignKey: "region_id", onDelete: "CASCADE", onUpdate: "CASCADE"});

User.hasMany(Order, {foreignKey: "user_id"});
Order.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE"});

Category.hasMany(Product, {foreignKey: "category_id"});
Product.belongsTo(Category, {foreignKey: "category_id", onDelete: "CASCADE", onUpdate: "CASCADE"});

User.hasMany(Product, {foreignKey: "author_id"});
Product.belongsTo(User, {foreignKey: "author_id", onDelete: "CASCADE", onUpdate: "CASCADE"})

Order.hasMany(OrderItem, {foreignKey: "order_id"});
OrderItem.belongsTo(Order, {foreignKey: "order_id", onDelete: "CASCADE", onUpdate: "CASCADE"});
Product.hasMany(OrderItem, {foreignKey: "product_id"});
OrderItem.belongsTo(Product, {foreignKey: "product_id", onDelete: "CASCADE", onUpdate: "CASCADE"});

User.hasMany(Comment, {foreignKey: "user_id"});
Comment.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE"});
Product.hasMany(Comment, {foreignKey: "product_id"});
Comment.belongsTo(Product, {foreignKey: "product_id", onDelete: "CASCADE", onUpdate: "CASCADE"});

module.exports = {
    Category,
    Comment, 
    Order,
    OrderItem,
    Product, 
    Region,
    User
}