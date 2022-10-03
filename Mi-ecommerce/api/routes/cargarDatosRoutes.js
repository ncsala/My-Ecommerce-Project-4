const express = require('express');
const router = express.Router();
const cargarDatosController = require('../controllers/cargarDatosControler');

router.post('/',cargarDatosController.carga);

module.exports = router;