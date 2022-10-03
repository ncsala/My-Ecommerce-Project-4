const express = require('express');
const db = require('../database/models');


const { cartList, cartEdit } = require('../controllers/cartController');

const { idByParamsSchema, editSchema } = require('../schemas/cartSchema');

//Middlewares
const {verifyJWT} = require('../middlewares/verifyJWT');
const validatorHandler = require('../middlewares/validatorHandler');

const router = express.Router();
router.use(verifyJWT)
router.get('/:id', validatorHandler(idByParamsSchema, 'params'), cartList);
router.put('/:id', validatorHandler(editSchema, 'body'), cartEdit);

module.exports = router;