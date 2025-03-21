const { Product, Category, User, Comment } = require('../model');
const logger = require('../logs/winston');
const { ProductValidationCreate, ProductPatchValidation } = require('../validation/product.validation');
const { fn, col, Op } = require('sequelize');

exports.createProduct = async (req, res) => {
    try {
        let { error, value } = ProductValidationCreate.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const categoryExists = await Category.findByPk(value.category_id);
        if (!categoryExists) {
            return res.status(400).json({ error: "Category not found" });
        }

        const { star, comment, ...filteredData } = value;

        const product = await Product.create(filteredData);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadImage = async(req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Rasm yuklanishi kerak" });
    }
    res.status(200).json({ message: "Rasm muvaffaqiyatli yuklandi", filename: req.file.filename });
}

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const allowedColumns = ["id", "name", "price"];
        const column = allowedColumns.includes(req.query.column) ? req.query.column : "id";

        
        const products = await Product.findAll({
            include: [
                { model: Category },
                { model: User, attributes: ["id", "fullName"] }, 
                { model: Comment, attributes: ["message"] } 
            ],
            attributes: {
                include: [
                    [fn("COALESCE", fn("AVG", col("comments.star")), 0), "star"] 
                ],
                exclude: ["comment"] 
            },
            group: ["products.id", "Category.id", "User.id", "comments.id"],
            subQuery: false,
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            limit: limit,
            offset: offset,
            order: [[column, order]]
        });

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category },
                { model: User, attributes: ["id", "fullName"] }, 
                { model: Comment, attributes: ["message"] } 
            ],
            attributes: {
                include: [
                    [fn("COALESCE", fn("AVG", col("comments.star")), 0), "star"] 
                ],
                exclude: ["comment"]
            },
            group: ["products.id", "Category.id", "User.id", "comments.id"]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
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

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Rasm yuklanishi kerak" });
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/image/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
};