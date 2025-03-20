const router = require('express').Router();
const categoryController = require('../controller/category.controller');
const verifyRole = require("../middlewares/verifyRole")
const verifyToken  = require("../middlewares/verifyToken");


router.get('/', categoryController.getAllCategories);
router.get('/:id',  categoryController.getCategoryById);
router.post('/', verifyToken,verifyRole(['ADMIN']), categoryController.createCategory);
router.patch('/:id', verifyToken,verifyRole(['ADMIN', 'SUPERADMIN']), categoryController.patchCategory);
router.delete('/:id',verifyToken,verifyRole(['ADMIN']), categoryController.deleteCategory);

module.exports = router;