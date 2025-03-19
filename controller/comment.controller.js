const { Comment, User, Product } = require('../model');
const logger = require('../logs/winston');
const { CommentValidationCreate } = require('../validation/comment.validation');

exports.createComment = async (req, res) => {
    try {
        let {error, value} = CommentValidationCreate.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const comment = await Comment.create(value);
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({ include: [User, Product] });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, { include: [User, Product] });
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCommentsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const comments = await Comment.findAll({
            where: { user_id },
            include: [User, Product]
        });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCommentsByProductId = async (req, res) => {
    try {
        const { product_id } = req.params;
        const comments = await Comment.findAll({
            where: { product_id },
            include: [User, Product]
        });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        let {error, value} = CommentValidationCreate.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        await comment.update(value);
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        await comment.destroy();
        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};