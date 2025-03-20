const { Region } = require('../model');
const logger = require('../logs/winston');
const RegionValidation = require('../validation/region.validation');
const { Op } = require('sequelize');

exports.createRegion = async (req, res) => {
    try {
        let { error, value } = RegionValidation.validate(req.body);
        if (error) {
            logger.warn(`error: ${error.details[0].message}`);
            return res.status(400).send(error.details[0].message);
        }
        const region = await Region.create(value);
        logger.info('region create');
        res.status(201).json(region);
    } catch (err) {
        logger.error(`create region error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllRegions = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const offset = (page - 1) * limit;

        const name = req.query.name || "";
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const coulmn = req.query.coulmn || "id"

        const regions = await Region.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            limit: limit,
            offset: offset,
            order: [[coulmn, order]]
        });
        logger.info('fetch all regions');
        res.status(200).json(regions);
    } catch (err) {
        logger.error(`regions error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.getRegionById = async (req, res) => {
    try {
        const { id } = req.params;
        const region = await Region.findByPk(id);
        if (!region) {
            logger.warn(`region with id ${id} not found`);
            return res.status(404).json({ message: "region not found" });
        }
        logger.info(`fetch region by id: ${id}`);
        res.status(200).json(region);
    } catch (err) {
        logger.error(`error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.updateRegion = async (req, res) => {
    try {
        let { error, value } = RegionValidation.validate(req.body);
        if (error) {
            logger.warn(`error: ${error.details[0].message}`);
            return res.status(400).send(error.details[0].message);
        }
        const region = await Region.findByPk(req.params.id);
        if (!region) {
            logger.warn(`region with id ${req.params.id} not found for update`);
            return res.status(404).json({ message: "region not found" });
        }
        await region.update(value);
        logger.info(`region update with id: ${req.params.id}`);
        res.status(200).json(region);
    } catch (err) {
        logger.error(`error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteRegion = async (req, res) => {
    try {
        const region = await Region.findByPk(req.params.id);
        if (!region) {
            logger.warn(`region with id ${req.params.id} not found for delete`);
            return res.status(404).json({ message: "region not found" });
        }
        await region.destroy();
        logger.info(`region delete with id: ${req.params.id}`);
        res.status(200).json({ message: "region delete" });
    } catch (err) {
        logger.error(`error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};