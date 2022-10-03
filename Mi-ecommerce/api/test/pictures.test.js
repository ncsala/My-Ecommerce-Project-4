const request = require('supertest');
const { app, server } = require('../server');
const models = require('../api/database/models');
const sinon = require('sinon');
const { generateToken } = require('./helpers');


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
describe('POST /pictures', () => {
	it('should create a new picture in the database with status response 201', async () => {
		//debo logueaerme desde la ruta o desde el test generando un token?
		const token = await generateToken('god');

		const newPicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description',
			productId: 1,
		};

		const response = await request(app)
			.post('/api/v1/pictures')
			.auth(token, { type: 'bearer' })
			.send(newPicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201);

		//testear que efectivamente este en la base de datos
		const picture = await models.Picture.findOne({
			where: { picture_id: response.body.data.picture_id },
		});
		expect(picture).toEqual(
			expect.objectContaining({
				picture_id: response.body.data.picture_id,
				picture_url: 'http://www.una-linda-picture.com',
				picture_description: 'Picture description',
				product_id: 1,
			})
		);
	});

}) 