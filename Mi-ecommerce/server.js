require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./api/database/models');

//Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

//Middlewares
const {
  logErrors,
	clientErrorHandler,
} = require('./api/middlewares/errorHandler');


// Carga de jsons
const users = require('./api/data.json/user.json')
const products = require('./api/data.json/products.json')
const categories = require('./api/data.json/categories.json')


const usersRoutes = require('./api/routes/usersRoutes');
const productsRoutes = require('./api/routes/productsRoutes');
const picturesRoutes = require('./api/routes/picturesRoutes');
const cartsRoutes = require('./api/routes/cartRoutes');
const categoryRoutes = require('./api/routes/categoryRoutes');
const usersController = require('./api/controllers/usersController');
const cargarDatosRoutes = require('./api/routes/cargarDatosRoutes');


const route = express.Router();
const app = express();

app.use(express.json());
// app.use(cors());

//Routes
app.use('/api/v1/', route);
route.post('/login', usersController.login);
route.use('/users', usersRoutes);
route.use('/products', productsRoutes);
route.use('/pictures', picturesRoutes);
route.use('/carts', cartsRoutes);
route.use('/category', categoryRoutes);
route.use('/cargar',cargarDatosRoutes),

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logErrors);
app.use(clientErrorHandler);

app.listen(process.env.PORT, () => {
	sequelize.sync(
		 //{ force: true } 
		);

	console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
