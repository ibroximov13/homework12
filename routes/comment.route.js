const router = require('express').Router();
const commentController = require('../controller/comment.controller');
const verifyToken  = require("../middlewares/verifyToken");

router.get('/',verifyToken, commentController.getAllComments);
router.get('/:id',verifyToken, commentController.getCommentById);
router.get('/by-user/:user_id',verifyToken, commentController.getCommentsByUserId);
router.get('/by-product/:product_id',verifyToken, commentController.getCommentsByProductId);
router.post('/',verifyToken, commentController.createComment);
router.put('/:id',verifyToken, commentController.updateComment);
router.delete('/:id',verifyToken, commentController.deleteComment);

module.exports = router;