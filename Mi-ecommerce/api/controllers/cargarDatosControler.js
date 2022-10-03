const db = require('../database/models');
// const moment = require('moment');

// Carga de jsons
const users = require('../data.json/user.json');
const products = require('../data.json/products.json');
const categories = require('../data.json/categories.json');
const pictures = require('../data.json/pictures.json');
const cartProducts = require('../data.json/cartProduct.json');

const cargarDatosController = {

	//carga
	carga: async function (req, res) {
		try {
			//cargar usuarios
			for await (let u of users) {
				await db.User.upsert({
					first_name: u.first_name,
					last_name: u.last_name,
					username: u.username,
					email: u.email,
					password: u.password,
					role: u.role,
					profilpic: u.profilepic,
				});
			}
			const users2 = await db.User.findAll({
				attributes: ['user_id'],
			});
			const usersMapped = users2.map((user) => user.user_id);

			//crear por cada id de usuario un carrito
			for await (let id of usersMapped) {
				await db.Cart.upsert({
					user_id: id,
					cart_id: id,
				});
			}
			//carga de categorias
			for await (let category of categories) {
				await db.Category.upsert({
					category_name: category.category_name,
				});
			}
			//listar productos
			for await (let product of products) {
				await db.Product.upsert({
					price: product.price,
					title: product.title,
					stock: product.stock,
					mostwanted: product.mostwanted,
          description: product.description,
					category_id: product.category,
				});
			}
			//carga picture
			for await (let picture of pictures) {
				await db.Picture.upsert({
					picture_url: picture.url,
					product_id: picture.productId,
				});
			}

			for await (let cartProduct of cartProducts) {
				await db.cart_product.upsert({
					cart_id: cartProduct.cart_id,
					product_id: cartProduct.product_id,
					quantity: cartProduct.quantity,
					// createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
					// updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
				});
			}

			res.status(201).json({
				error: false,
				msg: 'Se cargaron los datos exitosamente',
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: true, msg: error.message });
		}
	},
};
module.exports = cargarDatosController;
