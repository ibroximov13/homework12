const router = require('express').Router();
const commentController = require('../controller/comment.controller');
const orderController = require('../controller/order.controller');
const verifyTokenAndRole  = require("../middlewares/verifyTokenAndRole");

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
router.get('/', commentController.getAllComments);

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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of orders per page
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: "DESC"
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *           example: "id"
 *         description: Column to sort by
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fullname:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+123456789"
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 55
 *                         product:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             name:
 *                               type: string
 *                               example: "Laptop"
 *                             price:
 *                               type: number
 *                               example: 1200.99
 *                             image:
 *                               type: string
 *                               example: "https://example.com/images/laptop.jpg"
 *       500:
 *         description: Internal server error
 */

router.get('/', orderController.getAllOrders);

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
router.get('/:id', orderController.getOrderById);

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
router.post('/', orderController.createOrder);

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
router.patch('/:id', orderController.updateOrder);

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
router.delete('/:id', orderController.deleteOrder);

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
router.post("/order-item", orderController.createOrderItem);

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
router.get('/items/by-order/:order_id', orderController.getOrderItemsByOrderId);

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
router.get('/orders/items/by-product/:product_id', orderController.getOrderItemsByProductId);

module.exports = router;
