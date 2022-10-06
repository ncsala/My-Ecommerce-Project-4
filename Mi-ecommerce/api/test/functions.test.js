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
const { generateJWT } = require('../../helpers/generateJWT');

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

//verificar generate jwt con un payload
describe('should return a valid token', () => {
	it('should return a valid token', async () => {
		const payload = {
			role: 'god',
		};
		const token = await generateJWT(payload);

		expect(token).toEqual(expect.any(String));
	});

	//deberia retornar 'Invalid payload' si el payload es invalido
	it('should return "Failed to generate JWT" if payload is invalid', async () => {
		const payload = 'hola';

		// la promesa retorna 'No se pudo generar el JWT' como resultado
		generateJWT(payload)
			.then((result) => {
				expect(result).toEqual('Failed to generate JWT');
			})
			.catch((err) => {
				console.log(err);
			});
	});

});
