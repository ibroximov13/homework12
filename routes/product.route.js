const router = require('express').Router();
const productController = require('../controller/product.controller');
const verifyRole = require('../middlewares/verifyRole');
const verifyToken  = require("../middlewares/verifyToken");

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/by-user/:user_id', productController.getProductsByUserId);
router.get('/by-category/:category_id', productController.getProductsByCategoryId);
router.post('/',verifyToken, verifyRole(['ADMIN', 'SELLER']), productController.createProduct);
router.patch('/:id',verifyToken, verifyRole(['ADMIN', 'SUPERADMIN', 'SELLER']), productController.patchProduct); 
router.delete('/:id',verifyToken,verifyRole(['ADMIN','SELLER']), productController.deleteProduct);

module.exports = router;