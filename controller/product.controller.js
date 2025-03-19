const { Product, Category, User } = require('../model');
const logger = require('../logs/winston');
const { ProductValidationCreate } = require('../validation/product.validation');

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
        const products = await Product.findAll({ include: [Category, User] });
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