const { Product, Category, User } = require('../model');
const logger = require('../logs/winston');
const { ProductValidationCreate, ProductPatchValidation } = require('../validation/product.validation');
const { fn, col, Op } = require('sequelize');

exports.createProduct = async (req, res) => {
    try {
        let { error, value } = ProductValidationCreate.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const product = await Product.create(value);
        logger.info('product create');
        res.status(201).json(product);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const column = req.query.column || "id";
        const price = parseFloat(req.query.price) || 0;

        const products = await Product.findAll({ 
            include: [Category, User],
            attributes: {
                include: [
                    [fn('AVG', col('comments')), "averageStar"]
                ]
            },
            where: {
                name: {
                    [Op.like]: `%${name}%`
                },
                price: {
                    [Op.gte]: price
                }
            },
            limit: limit,
            offset: offset,
            order: [[column, order]]
        });
        logger.info('All products fetch');
        res.status(200).json(products);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: [Category, User] });
        if (!product) {
            logger.warn('product not found');
            return res.status(404).json({ message: "product not found" });
        }
        logger.info('product fetch by ID');
        res.status(200).json(product);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getProductsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const products = await Product.findAll({
            where: { user_id },
            include: [Category, User]
        });
        logger.info(`product fetch by user ID: ${user_id}`);
        res.status(200).json(products);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getProductsByCategoryId = async (req, res) => {
    try {
        const { category_id } = req.params;
        const products = await Product.findAll({
            where: { category_id },
            include: [Category, User]
        });
        logger.info(`product fetch by category ID: ${category_id}`);
        res.status(200).json(products);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let { error, value } = ProductValidationCreate.validate(req.body);
        if (error) {
            logger.warn(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            logger.warn('product not found for update');
            return res.status(404).json({ message: "product not found" });
        }
        await product.update(value);
        logger.info('product update');
        res.status(200).json(product);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.patchProduct = async (req, res) => {
    try {
        let {error, value} = ProductPatchValidation.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            logger.warn('product not found for patch');
            return res.status(404).json({ message: "product not found" });
        }
        await product.update(value); 
        logger.info('product patched');
        res.status(200).json(product);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            logger.warn('product not found for delete');
            return res.status(404).json({ message: "product not found" });
        }
        await product.destroy();
        logger.info('product delete');
        res.status(200).json({ message: "product delete" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};