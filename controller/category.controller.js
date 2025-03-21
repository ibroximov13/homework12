const logger = require('../logs/winston').child({ module: "category" });
const { Op } = require('sequelize');
const { Category } = require('../model');
const { CategoryValidationCreate, CategoryPatchValidation } = require('../validation/category.validation');

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

exports.uploadImage = async(req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Rasm yuklanishi kerak" });
    }
    res.status(200).json({ message: "Rasm muvaffaqiyatli yuklandi", filename: req.file.filename });
}


exports.getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const column = req.query.column || "id"

        const categories = await Category.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            limit: limit,
            offset: offset,
            order: [[column, order]]
        });
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

exports.patchCategory = async (req, res) => {
    try {
        let {error, value} = CategoryPatchValidation.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { id } = req.params;
        const { name, image } = value;
        const category = await Category.findByPk(id);
        if (!category) {
            logger.warn(`category with ID ${id} not found for patch`);
            return res.status(404).json({ message: "category not found" });
        }

        await category.update({
            name: name || category.name,
            image: image || category.image,
        });

        logger.info(`category patched with ID: ${category.id}`);
        res.status(200).json(category);
    } catch (err) {
        logger.error(`error patching category: ${err.message}`);
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

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Rasm yuklanishi kerak" });
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/image/${req.file.filename}`;
        res.status(200).json({ message: "Rasm muvaffaqiyatli yuklandi", url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
};