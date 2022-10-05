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

//si no hay token debe retornar No token provided
describe('should return 401 if no token provided', () => {
	it('should return 401 if no token provided', async () => {
		const response = await request(app)
			.get('/api/v1/products')
			.expect('Content-Type', /json/)
			.expect(401);
		expect(response.body).toEqual({
			error: true,
			msg: 'No token provided',
		});
	});

	//si el token es invalido debe retornar Invalid token
	it('should return 401 if invalid token provided', async () => {
		const response = await request(app)
			.get('/api/v1/products')
			.set('Authorization', 'Bearer 1234')
			.expect('Content-Type', /json/)
			.expect(401);
		expect(response.body).toEqual({
			error: true,
			msg: 'Invalid token',
		});
	});
});

//Verifica si el usuario tiene el rol correcto
describe('should return 401 if invalid role provided', () => {
	it('should return 401 if invalid role provided', async () => {
		const token = await generateToken('guest');

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
			.expect(401);
		expect(response.body).toEqual({
			error: true,
			msg: 'You are not authorized to access this resource',
		});
	});
});
