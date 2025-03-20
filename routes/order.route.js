const router = require('express').Router();
const orderController = require('../controller/order.controller');
const orderItemController = require('../controller/order.controller');
const verifyToken  = require("../middlewares/verifyToken");

router.get('/',verifyToken, orderController.getAllOrders);
router.get('/:id',verifyToken, orderController.getOrderById);
router.get('/by-user/:user_id',verifyToken, orderController.getOrdersByUserId);
router.post('/',verifyToken, orderController.createOrder);
router.put('/:id',verifyToken, orderController.updateOrder);
router.delete('/:id',verifyToken, orderController.deleteOrder);

router.get('/items/by-order/:order_id',verifyToken, orderItemController.getOrderItemsByOrderId);
router.get('/items/by-product/:product_id',verifyToken, orderItemController.getOrderItemsByProductId);

module.exports = router;