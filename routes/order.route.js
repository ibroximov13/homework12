const router = require('express').Router();
const orderController = require('../controller/order.controller');
const orderItemController = require('../controller/order.controller');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/by-user/:user_id', orderController.getOrdersByUserId);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

router.get('/items/by-order/:order_id', orderItemController.getOrderItemsByOrderId);
router.get('/items/by-product/:product_id', orderItemController.getOrderItemsByProductId);

module.exports = router;