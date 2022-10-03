const express = require('express');
const usersController = require('../controllers/usersController');

const { cartList, cartEdit } = require('../controllers/cartController');
const { idByParamsSchema } = require('../schemas/genericSchema');
const {
	createAndUpdateUserSchema,
	loginSchema,
} = require('../schemas/usersSchema');

// Middlewares
const { verifyJWT } = require('../middlewares/verifyJWT');
const validatorHandler = require('../middlewares/validatorHandler');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');

const router = express.Router();

router.post(
	'/',
	validatorHandler(createAndUpdateUserSchema, 'body'),
	usersController.createUser
);
router.post(
	'/login',
	validatorHandler(loginSchema, 'body'),
	usersController.login
);

router.use(verifyJWT);

router.get('/', userAuthMiddleware.listUsers, usersController.listUsers);

router.get(
	'/:id',
	validatorHandler(idByParamsSchema, 'params'),
	userAuthMiddleware.getUser,
	usersController.getUser
);

router.put(
	'/:id',
	validatorHandler(idByParamsSchema, 'params'),
	validatorHandler(createAndUpdateUserSchema, 'body'),
	userAuthMiddleware.updateUser,
	usersController.updateUser
);

router.delete(
	'/:id',
	validatorHandler(idByParamsSchema, 'params'),
	userAuthMiddleware.deleteUser,
	usersController.deleteUser
);

router.get(
	'/:id/carts',
	validatorHandler(idByParamsSchema, 'params'),
	cartList
);
router.put(
	'/:id/carts',
	validatorHandler(idByParamsSchema, 'params'),
	cartEdit
);

module.exports = router;
