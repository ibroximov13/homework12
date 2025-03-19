const router = require('express').Router();

router.use('/products', require('./product.route'));
router.use('/categories', require('./category.route'));
router.use('/regions', require('./region.route'));
router.use('/comments', require('./comment.route'));
router.use('/orders', require('./order.route'));
router.use('/users', require('./user.route'));


module.exports = router;