const router = require('express').Router();
const commentController = require('../controller/comment.controller');
const orderController = require('../controller/order.controller');
const productController = require('../controller/product.controller');
const verifyToken  = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const upload = require("../multer/product.multer");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get('/products', productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data.
 */
router.get('/products/:id', productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: integer
 *               star:
 *                 type: number
 *                 format: float
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully.
 */
router.post('/products', verifyToken, verifyRole(['ADMIN', 'SELLER']), productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
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
 *               author_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: integer
 *               star:
 *                 type: number
 *                 format: float
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully.
 */
router.patch('/products/:id', verifyToken, verifyRole(['ADMIN', 'SUPERADMIN', 'SELLER']), productController.patchProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully.
 */
router.delete('/products/:id', verifyToken, verifyRole(['ADMIN', 'SELLER']), productController.deleteProduct);

/**
 * @swagger
 * /products/upload-image:
 *   post:
 *     summary: Upload product image
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully.
 */
router.post("/products/upload-image", upload.single("productImage"), productController.uploadImage);

module.exports = router;
