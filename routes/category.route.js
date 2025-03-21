const router = require('express').Router();
const categoryController = require('../controller/category.controller');
const verifyTokenAndRole  = require("../middlewares/verifyTokenAndRole");
const upload = require('../multer/category.multer');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     description: "Retrieve a list of categories with optional filtering, sorting, and pagination."
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Electronics"
 *         description: "Filter categories by name (partial match)."
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: ["ASC", "DESC"]
 *           example: "ASC"
 *         description: "Sorting order (default: ASC)."
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *           example: "id"
 *         description: "Column to sort by (default: id)."
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Page number for pagination (default: 1)."
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "Number of categories per page (default: 10)."
 *     responses:
 *       200:
 *         description: "Successfully retrieved categories."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Electronics"
 *       500:
 *         description: "Internal server error."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.get('/', categoryController.getAllCategories);


/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Successfully retrieved category
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryController.getCategoryById);


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - photo
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               photo:
 *                 type: string
 *                 example: "https://example.com/category.jpg"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyTokenAndRole(["ADMIN"]), categoryController.createCategory);


/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */

router.patch('/:id', verifyTokenAndRole(['ADMIN', 'SUPERADMIN']), categoryController.patchCategory);


/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.delete('/:id', verifyTokenAndRole(['ADMIN']), categoryController.deleteCategory);


/**
 * @swagger
 * /categories/upload-image:
 *   post:
 *     summary: Upload category image
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */
router.post("/upload-image", upload.single("categoryImage"), categoryController.uploadImage);

module.exports = router;
