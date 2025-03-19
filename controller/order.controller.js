const { Order, OrderItem, Product, User } = require('../model');
const logger = require('../logs/winston');
const OrderValidation = require('../validation/order.validation');

exports.createOrder = async (req, res) => {
    try {
        let {error, value} = OrderValidation.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const order = await Order.create(value);
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ["id", "fullname", "email", "phone"] },
                {
                    model: OrderItem,
                    include: [{ model: Product, attributes: ["id", "name", "price", "image"] }]
                }
            ]
        });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ["id", "fullname", "email", "phone"] },
                {
                    model: OrderItem,
                    include: [{ model: Product, attributes: ["id", "name", "price", "image"] }]
                }
            ]
        });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const orders = await Order.findAll({
            where: { user_id },
            include: [
                { model: User, attributes: ["id", "fullname", "email", "phone"] },
                {
                    model: OrderItem,
                    include: [{ model: Product, attributes: ["id", "name", "price", "image"] }]
                }
            ]
        });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        let {error, value} = OrderValidation.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        await order.update(value);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        await order.destroy();
        res.status(200).json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderItemsByOrderId = async (req, res) => {
    try {
        const { order_id } = req.params;
        const orderItems = await OrderItem.findAll({
            where: { order_id },
            include: [Order, Product]
        });
        res.status(200).json(orderItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderItemsByProductId = async (req, res) => {
    try {
        const { product_id } = req.params;
        const orderItems = await OrderItem.findAll({
            where: { product_id },
            include: [Order, Product]
        });
        res.status(200).json(orderItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//orderItem qoshish kerak post