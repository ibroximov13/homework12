const router = require('express').Router();
const commentController = require('../controller/comment.controller');
const orderController = require('../controller/order.controller');
const verifyToken  = require("../middlewares/verifyToken");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments management
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of comments.
 */
router.get('/', verifyToken, commentController.getAllComments);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Orders management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders.
 */
router.get('/orders', verifyToken, orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order data.
 */
router.get('/orders/:id', verifyToken, orderController.getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created successfully.
 */
router.post('/orders', verifyToken, orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Update an order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully.
 */
router.patch('/orders/:id', verifyToken, orderController.updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 */
router.delete('/orders/:id', verifyToken, orderController.deleteOrder);

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Order items management
 */

/**
 * @swagger
 * /orders/order-item:
 *   post:
 *     summary: Create an order item
 *     tags: [Order Items]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               count:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order item created successfully.
 */
router.post("/orders/order-item", verifyToken, orderController.createOrderItem);

/**
 * @swagger
 * /orders/items/by-order/{order_id}:
 *   get:
 *     summary: Get order items by order ID
 *     tags: [Order Items]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of order items for the given order.
 */
router.get('/orders/items/by-order/:order_id', verifyToken, orderController.getOrderItemsByOrderId);

/**
 * @swagger
 * /orders/items/by-product/{product_id}:
 *   get:
 *     summary: Get order items by product ID
 *     tags: [Order Items]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of order items for the given product.
 */
router.get('/orders/items/by-product/:product_id', verifyToken, orderController.getOrderItemsByProductId);

module.exports = router;
