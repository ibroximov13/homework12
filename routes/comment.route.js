const router = require('express').Router();
const commentController = require('../controller/comment.controller');

router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.get('/by-user/:user_id', commentController.getCommentsByUserId);
router.get('/by-product/:product_id', commentController.getCommentsByProductId);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;