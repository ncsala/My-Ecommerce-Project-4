// jest.useFakeTimers();
const request = require('supertest');
const { app, server } = require('../../server');
const db = require('../database/models');
const sinon = require('sinon');
const {
	generateToken,
	loadingDataInTestingDB,
	cargarDatos,
} = require('./helpers');

beforeAll(async () => {
	// await db.sequelize.sync({ force: true });
	// await loadingDataInTestingDB();
	await cargarDatos();
});

//Tests para crear una picture -------------------------------------------------------
describe('POST /api/v1/pictures', () => {
	it('should create a new picture in the database with status response 201', async () => {
		//debo logueaerme desde la ruta o desde el test generando un token?
		const token = await generateToken('god');

		const newPicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description',
			productId: 3,
		};

		const response = await request(app)
			.post('/api/v1/pictures')
			.auth(token, { type: 'bearer' })
			.send(newPicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(201);

		// Se espera que la picture este creada en la base de datos
		const picture = await db.Picture.findOne({
			where: { picture_id: response.body.data.picture_id },
		});
		expect(picture).toEqual(
			expect.objectContaining({
				picture_id: response.body.data.picture_id,
				picture_url: 'http://www.una-linda-picture.com',
				picture_description: 'Picture description',
				product_id: 3,
			})
		);
	});

	it('should return 404 if product does not exist', async () => {
		const token = await generateToken('god');

		const newPicture = {
			pictureUrl: 'http://www.otra-picture.com',
			pictureDescription: 'Picture description',
			productId: 4000,
		};

		const response = await request(app)
			.post('/api/v1/pictures')
			.auth(token, { type: 'bearer' })
			.send(newPicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404);
		expect(response.body).toEqual({
			error: true,
			msg: 'Product not found',
		});
	});

	it('should return 400 if pictureUrl is not provided', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.post('/api/v1/pictures')
			.auth(token, { type: 'bearer' })
			.send({
				pictureDescription: 'Picture description',
				productId: 1,
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body.msg).toEqual('URL is required');
	});

	it('should return 400 if productId is not provided', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.post('/api/v1/pictures')
			.auth(token, { type: 'bearer' })
			.send({
				pictureUrl: 'http://www.una-linda-picture.com',
				pictureDescription: 'Picture description',
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body.msg).toBe('Product Id is required');
	});

	it('should return 500 if there is an error on the server', async () => {
		const token = await generateToken('god');

    const newPicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description',
			productId: 3,
		};

		//Simulo un error en la base de datos
		const stub = sinon.stub(db.Picture, 'create').throws('Error');

		const response = await request(app)
			.post('/api/v1/pictures')
			.auth(token, { type: 'bearer' })
      .send(newPicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(500);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);

		//Restauro el metodo findAll
		stub.restore();
	});
});
// --------------------------------------------------------------------------------------

// Tests para obtener todas las pictures de un producto
//------------------------------------------------------------------------------
describe('GET /api/v1/pictures?product=', () => {
	/// probar si funciona con varias imagenes
	it('should return all pictures of a product with status response 200', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures?product=1')
			.auth(token, { type: 'bearer' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					picture_id: expect.any(Number),
					picture_url: expect.any(String),
					picture_description: expect.toBeOneOf([null, expect.any(String)]),
					product_id: expect.any(Number),
				}),
			])
		);
	});

	it('should return 400 if product is not a valid option, for example `abc`', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures?product=abc')
			.auth(token, { type: 'bearer' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);
	});

	it('should return 404 if product does not exist', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures?product=4000')
			.auth(token, { type: 'bearer' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404);
		expect(response.body.msg).toBe('Product not found');
	});

	it('should return 404 if the product does not have any picture', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures?product=7')
			.auth(token, { type: 'bearer' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404);
		expect(response.body.msg).toBe('The product does not have images');
	});

	it('should return 500 if there is an error on the server', async () => {
		const token = await generateToken('god');

		const stub = sinon.stub(db.Picture, 'findAll').throws();

		const response = await request(app)
			.get('/api/v1/pictures?product=1')
			.auth(token, { type: 'bearer' })
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(500);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);

		stub.restore();
	});
});
//------------------------------------------------------------------------------

// Tests para obtener una picture por id
//------------------------------------------------------------------------------
describe('GET /api/v1/pictures/:id', () => {
	it('should respond with a 200 status code and get the picture', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures/1')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body).toEqual({
			error: false,
			msg: 'Picture found',
			data: {
				picture_id: expect.any(Number),
				picture_url: expect.any(String),
				product_id: expect.any(Number),
				picture_description: expect.toBeOneOf([null, expect.any(String)]),
			},
		});
	});

	it('should return 404 if the picture does not exist', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures/4000')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(404);
		expect(response.body.msg).toBe('Picture not found');
	});

	it('should return 400 if id is not a valid option, for example `abc`', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.get('/api/v1/pictures/abc')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);
	});

	it('should return 500 if there is an error on the server', async () => {
		const token = await generateToken('god');

		const stub = sinon.stub(db.Picture, 'findOne').throws();

		const response = await request(app)
			.get('/api/v1/pictures/1')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(500);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);

		stub.restore();
	});
});
//-----------------------------------------------------------------------------

// Tests para actualizar una picture ------------------------------------------------
describe('PUT /pictures/:id', () => {
	it('should update a picture in database with status response 200', async () => {
		const token = await generateToken('god');
		const updatePicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description updated',
		};

		const response = await request(app)
			.put('/api/v1/pictures/1')
			.auth(token, { type: 'bearer' })
			.send(updatePicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				error: false,
				msg: 'Picture updated',
				data: {
					picture_id: response.body.data.picture_id,
					picture_url: 'http://www.una-linda-picture.com',
					product_id: response.body.data.product_id,
					picture_description: 'Picture description updated',
				},
			})
		);
	});

	it('should return 404 if the picture does not exist', async () => {
		const token = await generateToken('god');
		const updatePicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description updated',
		};

		const response = await request(app)
			.put('/api/v1/pictures/4000')
			.auth(token, { type: 'bearer' })
			.send(updatePicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404);
		expect(response.body.msg).toBe('Picture not found');
	});

	it('should return 400 if id is not a valid option, for example `abc`', async () => {
		const token = await generateToken('god');
		const updatePicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description updated',
		};

		const response = await request(app)
			.put('/api/v1/pictures/abc')
			.auth(token, { type: 'bearer' })
			.send(updatePicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);
	});

	it('should return 400 if pictureUrl is not provided', async () => {
		const token = await generateToken('god');
		const updatePicture = {
			pictureDescription: 'Picture description updated',
		};

		const response = await request(app)
			.put('/api/v1/pictures/1')
			.auth(token, { type: 'bearer' })
			.send(updatePicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);
		expect(response.body.msg).toBe('URL is required');
	});

	it('should return 500 if there is an error on the server', async () => {
		const token = await generateToken('god');
		const updatePicture = {
			pictureUrl: 'http://www.una-linda-picture.com',
			pictureDescription: 'Picture description updated',
		};

		const stub = sinon.stub(db.Picture, 'update').throws();

		const response = await request(app)
			.put('/api/v1/pictures/1')
			.auth(token, { type: 'bearer' })
			.send(updatePicture)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(500);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);

		stub.restore();
	});
});
// ---------------------------------------------------------------------------------

// Tests para eliminar una picture ------------------------------------------------
describe('DELETE /pictures/:id', () => {
	it('should delete a picture in database with status response 200', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.delete('/api/v1/pictures/1')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				error: false,
				msg: 'Picture deleted',
			})
		);
	});

	it('should return 404 if the picture does not exist', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.delete('/api/v1/pictures/4000')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(404);
		expect(response.body.msg).toBe('Picture not found');
	});

	it('should return 400 if id is not a valid option, for example `abc`', async () => {
		const token = await generateToken('god');

		const response = await request(app)
			.delete('/api/v1/pictures/abc')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(400);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);
	});

	it('should return 500 if there is an error on the server', async () => {
		const token = await generateToken('god');

		const stub = sinon.stub(db.Picture, 'destroy').throws();

		const response = await request(app)
			.delete('/api/v1/pictures/5')
			.auth(token, { type: 'bearer' })
			.expect('Content-Type', /json/)
			.expect(500);
		expect(response.body).toHaveProperty('error');
		expect(response.body).toHaveProperty('msg');
		expect(response.body.error).toBe(true);

		stub.restore();
	});
});
// ---------------------------------------------------------------------------------