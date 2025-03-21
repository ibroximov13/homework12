const { Comment, User, Product } = require('../model');
const logger = require('../logs/winston');
const { CommentValidationCreate, CommentPatchValidation } = require('../validation/comment.validation');
const { Op } = require('sequelize');

exports.createComment = async (req, res) => {
    try {
        const { error, value } = CommentValidationCreate.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const comment = await Comment.create(value);
        logger.info('Comment created');
        res.status(201).json(comment);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const column = req.query.column || "id"

        const comments = await Comment.findAll({ 
            where: {
                message: {
                    [Op.like]: `%${name}%`
                }
            },
            include: [User, Product],
            limit: limit,
            offset: offset,
            order: [[column, order]]
        });
        logger.info('All comments fetche');
        res.status(200).json(comments);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, { include: [User, Product] });
        if (!comment) {
            logger.warn('comment not found');
            return res.status(404).json({ message: "Comment not found" });
        }
        logger.info('Comment fetch by ID');
        res.status(200).json(comment);
    } catch (err) {
        logger.error(err.message);
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
        logger.info('Comment fetch by user ID');
        res.status(200).json(comments);
    } catch (err) {
        logger.error(err.message);
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
        logger.info('Comment fetch by product ID');
        res.status(200).json(comments);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};


exports.patchComment = async (req, res) => {
    try {
        let {error, value} = CommentPatchValidation.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            logger.warn('comment not found for patch');
            return res.status(404).json({ message: "comment not found" });
        }
        await comment.update(value);
        logger.info('comment patch');
        res.status(200).json(comment);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            logger.warn('comment not found for delete');
            return res.status(404).json({ message: "comment not found" });
        }
        await comment.destroy();
        logger.info('comment delet');
        res.status(200).json({ message: "comment delete" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};