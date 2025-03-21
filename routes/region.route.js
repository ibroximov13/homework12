const router = require('express').Router();
const regionController = require('../controller/region.controller');
const verifyTokenAndRole = require("../middlewares/verifyTokenAndRole");

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
 *     description: "List all available regions with optional filtering and sorting."
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Toshkent"
 *         description: "Filter regions by name (partial match)."
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: ["ASC", "DESC"]
 *           example: "ASC"
 *         description: "Sorting order (default: ASC)."
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *           example: "id"
 *         description: "Column to sort by (default: id)."
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Page number for pagination (default: 1)."
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "Number of regions per page (default: 10)."
 *     responses:
 *       200:
 *         description: "A list of regions."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Toshkent"
 *       500:
 *         description: "Internal server error."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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
router.post('/', verifyTokenAndRole(['ADMIN']), regionController.createRegion);

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
router.patch('/:id', verifyTokenAndRole(['ADMIN','SUPERADMIN']), regionController.updateRegion);

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
router.delete('/:id', verifyTokenAndRole(['ADMIN']), regionController.deleteRegion);

module.exports = router;
