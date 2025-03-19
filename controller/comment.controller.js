const { Comment, User, Product } = require('../model');
const logger = require('../logs/winston');
const { CommentValidationCreate } = require('../validation/comment.validation');

exports.createComment = async (req, res) => {
    try {
        const { error, value } = CommentValidationCreate.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const comment = await Comment.create(value);
        logger.info('comment create');
        res.status(201).json(comment);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const column = req.query.column || "id"

        const comments = await Comment.findAll({ 
            include: [User, Product],
            where: {
                message: {
                    [Op.like]: `%${name}%`
                }
            },
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
            return res.status(404).json({ message: "comment not found" });
        }
        logger.info('comment fetche by ID');
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
        logger.info('comment fetched by user ID');
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
        logger.info('comment fetched by product ID');
        res.status(200).json(comments);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { error, value } = CommentValidationCreate.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            logger.warn('comment not found for update');
            return res.status(404).json({ message: "comment not found" });
        }
        await comment.update(value);
        logger.info('Comment update');
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
            logger.warn('Comment not found ');
            return res.status(404).json({ message: "comment not found" });
        }
        await comment.destroy();
        logger.info('comment delete');
        res.status(200).json({ message: "comment delete" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};