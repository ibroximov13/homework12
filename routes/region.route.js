const router = require('express').Router();
const regionController = require('../controller/region.controller');
const verifyRole = require("../middlewares/verifyRole");
const verifyToken  = require("../middlewares/verifyToken");

/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Region management
 */

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Get all regions
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: A list of regions.
 */
router.get('/', regionController.getAllRegions);

/**
 * @swagger
 * /regions/{id}:
 *   get:
 *     summary: Get a region by ID
 *     tags: [Regions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Region data.
 */
router.get('/:id', regionController.getRegionById);

/**
 * @swagger
 * /regions:
 *   post:
 *     summary: Create a new region
 *     tags: [Regions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Region created successfully.
 */
router.post('/', verifyToken, verifyRole(['ADMIN']), regionController.createRegion);

/**
 * @swagger
 * /regions/{id}:
 *   patch:
 *     summary: Update a region
 *     tags: [Regions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Region updated successfully.
 */
router.patch('/:id', verifyToken, verifyRole(['ADMIN','SUPERADMIN']), regionController.updateRegion);

/**
 * @swagger
 * /regions/{id}:
 *   delete:
 *     summary: Delete a region
 *     tags: [Regions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Region deleted successfully.
 */
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), regionController.deleteRegion);

module.exports = router;
