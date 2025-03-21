const router = require('express').Router();
const commentController = require('../controller/comment.controller');
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
 *         description: Number of comments per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Great product"
 *         description: Filter comments by message content
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
 *         description: A list of comments.
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
 *                   message:
 *                     type: string
 *                     example: "Great product!"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                   product:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: "Laptop"
 *       500:
 *         description: Internal server error
 */

router.get('/', commentController.getAllComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
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
 *         description: Comment data.
 */
router.get('/:id', commentController.getCommentById);

/**
 * @swagger
 * /comments/by-user/{user_id}:
 *   get:
 *     summary: Get comments by user ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments data.
 */
router.get('/by-user/:user_id', commentController.getCommentsByUserId);

/**
 * @swagger
 * /comments/by-product/{product_id}:
 *   get:
 *     summary: Get comments by product ID
 *     tags: [Comments]
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
 *         description: Comments data.
 */
router.get('/by-product/:product_id', commentController.getCommentsByProductId);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
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
 *               product_id:
 *                 type: integer
 *               message:
 *                 type: string
 *               star:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment created successfully.
 */
router.post('/', commentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
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
 *               product_id:
 *                 type: integer
 *               message:
 *                 type: string
 *               star:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 */
router.patch('/:id', commentController.patchComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
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
 *         description: Comment deleted successfully.
 */
router.delete('/:id', verifyTokenAndRole(["ADMIN", "USER", "SUPERADMIN"]), commentController.deleteComment);

module.exports = router;
