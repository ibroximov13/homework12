const { Order, OrderItem, Product, User } = require('../model');
const logger = require('../logs/winston');
const OrderValidation = require('../validation/order.validation');

exports.createOrder = async (req, res) => {
    try {
        let { error, value } = OrderValidation.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const order = await Order.create(value);
        logger.info('order create');
        res.status(201).json(order);
    } catch (err) {
        logger.error(err.message);
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
        logger.info('All orders fetch');
        res.status(200).json(orders);
    } catch (err) {
        logger.error(err.message);
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
        if (!order) {
            logger.warn('order not found');
            return res.status(404).json({ message: "order not found" });
        }
        logger.info('order fetch by ID');
        res.status(200).json(order);
    } catch (err) {
        logger.error(err.message);
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
        logger.info(`order fetch by user ID: ${user_id}`);
        res.status(200).json(orders);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        let { error, value } = OrderValidation.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            logger.warn('order not found for update');
            return res.status(404).json({ message: "rder not found" });
        }
        await order.update(value);
        logger.info('order update');
        res.status(200).json(order);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            logger.warn('order not found for delete');
            return res.status(404).json({ message: "order not found" });
        }
        await order.destroy();
        logger.info('order delete');
        res.status(200).json({ message: "order delete" });
    } catch (err) {
        logger.error(err.message);
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
        logger.info(`order items fetch by order ID: ${order_id}`);
        res.status(200).json(orderItems);
    } catch (err) {
        logger.error(err.message);
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
        logger.info(`order items fetch by product ID: ${product_id}`);
        res.status(200).json(orderItems);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};