const router = require('express').Router();
const commentController = require('../controller/comment.controller');
const verifyToken  = require("../middlewares/verifyToken");

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
 *     responses:
 *       200:
 *         description: A list of comments.
 */
router.get('/', verifyToken, commentController.getAllComments);

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
router.get('/:id', verifyToken, commentController.getCommentById);

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
router.get('/by-user/:user_id', verifyToken, commentController.getCommentsByUserId);

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
router.get('/by-product/:product_id', verifyToken, commentController.getCommentsByProductId);

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
router.post('/', verifyToken, commentController.createComment);

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
router.patch('/:id', verifyToken, commentController.patchComment);

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
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router;
