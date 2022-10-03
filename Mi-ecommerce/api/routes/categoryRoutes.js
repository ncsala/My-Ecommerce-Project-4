const express = require('express');
const router = express.Router();

//schema
const { idByParamsSchema } = require('../schemas/genericSchema');
const { createCategorySchema } = require('../schemas/categorySchema');
//controlador
const categoryController = require('../controllers/categoryControler');
//middlewares
const validatorHandler = require('../middlewares/validatorHandler');
const roleVerification = require('../middlewares/roleVerification');
const { verifyJWT } = require('../middlewares/verifyJWT');
router.use(verifyJWT);

router.get(
	'/',
	roleVerification('admin', 'god', 'guest'),
	categoryController.listCategory
);
router.post(
	'/',
  roleVerification("admin", "god"),
	validatorHandler(createCategorySchema, 'body'),
	categoryController.createCategory
);
router.delete(
	'/:id',
  roleVerification("admin", "god", "guest"),
	validatorHandler(idByParamsSchema, 'params'),
	categoryController.deleteCategory
);
router.put(
	'/:id',
  roleVerification("admin", "god", "guest"),
	validatorHandler(createCategorySchema, 'body'),
	validatorHandler(idByParamsSchema, 'params'),
	categoryController.updateCategory
);
module.exports = router;
