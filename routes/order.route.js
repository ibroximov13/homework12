const router = require('express').Router();
const orderController = require('../controller/order.controller');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/by-user/:user_id', orderController.getOrdersByUserId);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.patch('/:id', orderController.patchOrder);  
router.delete('/:id', orderController.deleteOrder);

router.post("/order-item", orderController.createOrderItem);
router.get('/items/by-order/:order_id', orderController.getOrderItemsByOrderId);
router.get('/items/by-product/:product_id', orderController.getOrderItemsByProductId);

module.exports = router;