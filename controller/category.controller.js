const logger = require('../logs/winston').child({ module: "category" });
const { Category } = require('../model');
const { CategoryValidationCreate } = require('../validation/category.validation');

exports.createCategory = async (req, res) => {
    try {
        
        const { error, value } = CategoryValidationCreate.validate(req.body);
        if (error) {
            logger.warn(`validation error: ${error.details[0].message}`);
            return res.status(400).send(error.details[0].message);
        }
        const category = await Category.create(value);
        logger.info(`category create with ID: ${category.id}`);
        res.status(201).json(category);
    } catch (err) {
        logger.error(`error creating category: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        logger.info(`Fetched ${categories.length} categories`);
        res.status(200).json(categories);
    } catch (err) {
        logger.error(`error fetching categories: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            logger.warn(`category with ID ${id} not found`);
            return res.status(404).json({ message: "category not found" });
        }
        logger.info(`fetched category with ID: ${id}`);
        res.status(200).json(category);
    } catch (err) {
        logger.error(`error fetching category by ID: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { error, value } = CategoryValidationCreate.validate(req.body);
        if (error) {
            logger.warn(`Validation error: ${error.details[0].message}`);
            return res.status(400).send(error.details[0].message);
        }
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            logger.warn(`category with ID ${req.params.id} not found for update`);
            return res.status(404).json({ message: "category not found" });
        }
        await category.update(value);
        logger.info(`category updated with ID: ${category.id}`);
        res.status(200).json(category);
    } catch (err) {
        logger.error(`error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            logger.warn(`category with ID ${req.params.id} not found for delete`);
            return res.status(404).json({ message: "category not found" });
        }
        await category.destroy();
        logger.info(`category deleted with ID: ${req.params.id}`);
        res.status(200).json({ message: "category delete" });
    } catch (err) {
        logger.error(`error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};