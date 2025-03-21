const { Order, OrderItem, Product, User } = require('../model');
const logger = require('../logs/winston');
const orderValidation = require('../validation/order.validation');

exports.createOrder = async (req, res) => {
    try {
        let {error, value} = orderValidation.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: User ID is missing" });
        }

        const userId = req.user.id;
        const { products } = value;

        const order = await Order.create({ user_id: userId });

        const mergedItems = products.reduce((acc, item) => {
            const existingItem = acc.find(i => i.product_id === item.product_id);
            if (existingItem) {
                existingItem.count += item.count;
            } else {
                acc.push({ ...item });
            }
            return acc;
        }, []);

        const orderItems = await OrderItem.bulkCreate(
            mergedItems.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                count: item.count
            })),
            { returning: true } 
        );

        const orderedProducts = await OrderItem.findAll({
            where: {
                order_id: order.id
            },
            attributes: {
                exclude: ["product_id"]
            },
            include: [
                {
                    model: Product,
                    attributes: ["id","name", "price"],
                }
            ]
        })

        const totalSumma = orderedProducts.reduce((sum, item) => {
            return sum + (item.count * item.product.price);
        }, 0);

        res.status(201).json({ order, orderedProducts, totalSumma });
    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const allowedColumns = ["id", "createdAt", "updatedAt"]; 
        const column = allowedColumns.includes(req.query.column) ? req.query.column : "id";

        const order = req.query.order && req.query.order.toUpperCase() === "DESC" ? "DESC" : "ASC";

        const orders = await Order.findAll({
            attributes: {exclude: "user_id"},
            include: [
                { model: User, attributes: ["id", "fullname", "phone"] },
                {
                    model: OrderItem,
                    include: [{ model: Product, attributes: ["id", "name", "price"] }]
                }
            ],
            limit,
            offset,
            order: [[column, order]]
        });

        logger.info('All orders fetched successfully');
        res.status(200).json(orders);
    } catch (err) {
        logger.error(`Error fetching orders: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findAll({
            where: { id },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            attributes: ["id", "name", "price"]
                        }
                    ]
                }
            ]
        });

        if (!order.length) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        let { error, value } = orderValidation.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const orderItem = await OrderItem.findOne({
            where: {
                order_id: value.order_id,  
                product_id: value.product_id, 
            }
        });

        if (!orderItem) {
            logger.warn('Order not found for update');
            return res.status(404).json({ message: "Order not found. Please check the order ID and product ID." });
        }

        await orderItem.update({
            count: value.count, 
        });

        logger.info('Order updated successfully');
        res.status(200).json({ message: "Order updated", updatedOrder: orderItem });

    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
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
        res.status(200).json({ message: "order deleted" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};


exports.getMyOrder = async (req, res) => {
    try {
        const { id } = req.user;

        const order = await Order.findAll({
            where: { id },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            attributes: ["id", "name", "price"]
                        }
                    ]
                }
            ]
        });

        if (!order.length) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
