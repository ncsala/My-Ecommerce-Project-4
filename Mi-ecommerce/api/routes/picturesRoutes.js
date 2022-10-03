const express = require('express');
const db = require('../database/models');
const {
	getPicture,
	getPictures,
	createPicture,
	updatePicture,
	deletePicture,
} = require('../controllers/picturesController');
const {
	getProductPicturesSchema,
	createSchema,
	updateSchema,
} = require('../schemas/picturesSchema');
const { idByParamsSchema } = require('../schemas/genericSchema');

// Middlewares
const { verifyJWT } = require('../middlewares/verifyJWT');
const validatorHandler = require('../middlewares/validatorHandler');
const roleVerification = require('../middlewares/rolVerification');

const router = express.Router();

router.use(verifyJWT);

router.get(
	'/',
	// rolVerification.generic,
	validatorHandler(getProductPicturesSchema, 'query'),
	getPictures
);

router.get(
	'/:id',
	roleVerification("admin", "god", "guest"),
	validatorHandler(idByParamsSchema, 'params'),
	getPicture
);

router.post(
	'/',
	// rolVerification.admin,
	validatorHandler(createSchema, 'body'),
	createPicture
);

router.put(
	'/:id',
  // rolVerification.admin,
	validatorHandler(idByParamsSchema, 'params'),
	validatorHandler(updateSchema, 'body'),
	updatePicture
);

router.delete(
	'/:id',
  // rolVerification.admin,
	validatorHandler(idByParamsSchema, 'params'),
	deletePicture
);

module.exports = router;
