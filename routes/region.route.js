const router = require('express').Router();
const regionController = require('../controller/region.controller');
const verifyRole = require("../middlewares/verifyRole")
const verifyToken  = require("../middlewares/verifyToken");

router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);
router.post('/',verifyToken, verifyRole(['ADMIN']), regionController.createRegion);
router.patch('/:id',verifyToken, verifyRole(['ADMIN','SUPERADMIN']), regionController.updateRegion);
router.delete('/:id',verifyToken, verifyRole(['ADMIN']), regionController.deleteRegion);

module.exports = router;