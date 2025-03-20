const router = require('express').Router();
const productController = require('../controller/product.controller');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/by-user/:user_id', productController.getProductsByUserId);
router.get('/by-category/:category_id', productController.getProductsByCategoryId);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.patch('/:id', productController.patchProduct); 
router.delete('/:id', productController.deleteProduct);

module.exports = router;