const request = require('supertest');
const { app, server } = require('../../server');
const db = require('../database/models');
const sinon = require('sinon');
const {carga , generateToken } = require('./helpers');
const { Op } = require('sequelize');


afterAll(() => {
	// models.sequelize.close()
	// await models.sequelize.sync({ force: true });
});

afterEach(() => {
	//borrar base de datos
	// models.sequelize.sync({ force: true });
	// otra forma
	// models.sequelize.drop();
	server.close();
});

beforeAll(async ()=>{

	db.User.destroy({
		where:{
			user_id:{
				[Op.gt]:0
			}
		}
	})

	db.Product.destroy({
		where:{
			product_id:{
				[Op.gt]:0
			}
		}
	})

	db.Picture.destroy({
		where:{
			picture_id:{
				[Op.gt]:0
			}
		}
	})

	db.Cart.destroy({
		where:{
			cart_id:{
				[Op.gt]:0
			}
		}
	})
	carga()
})

test('/',()=>{
	expect(1).toBe(1);
})

//CREAR UNA CAGTEGORIA
// describe('POST /api/v1/category', () => {
// 	it('should create a category', async () => {
// 		const response = await request(app)
// 			.post('/api/v1/category')
// 			.send({
// 				name: 'Categoriaaa',
// 			})
// 			.set('Accept', 'application/json')
// 			.expect('Content-Type', /json/)
// 			.expect(201);
// 		expect(response.body.data.category_name).toBe('Categoriaaa');
// 	});
// });

//Tests para crear una picture ---------------------------------------------------------------------
// describe('POST /pictures', () => {
// 	it('should create a new picture in the database with status response 201', async () => {
// 		//debo logueaerme desde la ruta o desde el test generando un token?
// 		const token = await generateToken('god');

// 		const newPicture = {
// 			pictureUrl: 'http://www.una-linda-picture.com',
// 			pictureDescription: 'Picture description',
// 			productId: 1,
// 		};

// 		const response = await request(app)
// 			.post('/api/v1/pictures')
// 			.auth(token, { type: 'bearer' })
// 			.send(newPicture)
// 			.set('Accept', 'application/json')
// 			.expect('Content-Type', /json/)
// 			.expect(201);

// 		//testear que efectivamente este en la base de datos
// 		const picture = await db.Picture.findOne({
// 			where: { picture_id: response.body.data.picture_id },
// 		});
// 		expect(picture).toEqual(
// 			expect.objectContaining({
// 				picture_id: response.body.data.picture_id,
// 				picture_url: 'http://www.una-linda-picture.com',
// 				picture_description: 'Picture description',
// 				product_id: 1,
// 			})
// 		);
// 	});

// }) 