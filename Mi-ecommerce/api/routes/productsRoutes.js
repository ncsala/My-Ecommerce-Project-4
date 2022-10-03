const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const dataValidation = require('../middlewares/productDataValidation');
const { verifyJWT } = require('../middlewares/verifyJWT');
const {
	createProductSchema,
	searchProductSchema,
	updateProductSchema,
  categoryPoductSchema
} = require('../schemas/productsSchema');
const { idByParamsSchema } = require('../schemas/genericSchema');
const validatorHandler = require('../middlewares/validatorHandler');

router.use(verifyJWT);

router.get('/', 
validatorHandler(categoryPoductSchema,'query'),
productsController.listar);

router.get('/mostwanted', productsController.mostwanted);

router.get(
	'/search',
	validatorHandler(searchProductSchema, 'query'),
	productsController.busqueda
);

router.get(
	'/:id/pictures',
	validatorHandler(idByParamsSchema, 'params'),
	productsController.pictures
);

router.get(
	'/:id',
	validatorHandler(idByParamsSchema, 'params'),
	productsController.detalle
);

router.post(
	'/',
	validatorHandler(createProductSchema, 'body'),
	productsController.crear
);

router.delete(
	'/:id',
	validatorHandler(idByParamsSchema, 'params'),
	productsController.eliminar
);

router.put(
	'/:id',
	validatorHandler(idByParamsSchema, 'params'),
	validatorHandler(updateProductSchema, 'body'),
	productsController.modificar
);

module.exports = router;
