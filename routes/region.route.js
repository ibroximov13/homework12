const router = require('express').Router();
const regionController = require('../controller/region.controller');

router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);
router.post('/', regionController.createRegion);
router.put('/:id', regionController.updateRegion);
router.patch('/:id', regionController.patchRegion); 
router.delete('/:id', regionController.deleteRegion);

module.exports = router;