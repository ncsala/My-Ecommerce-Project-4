// jest.useFakeTimers();
const request = require('supertest');
const { app } = require('../../server');
const db = require('../database/models');
const sinon = require('sinon');
const {
	generateToken,
	loadingDataInTestingDB,
	cargarDatos,
} = require('./helpers');

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  // await loadingDataInTestingDB();
  // await cargarDatos();
});

describe('POST /api/v1/cargar', () => {
	it('should return 201 if data loaded', async () => {
		const response = await request(app)
			.post('/api/v1/cargar')
			.expect('Content-Type', /json/)
			.expect(201);
		expect(response.body).toEqual({
			error: false,
			msg: 'Se cargaron los datos exitosamente',
		});
	});

  it('should return 500 if data not loaded', async () => {
    //usar sinon para simular el error
    sinon.stub(db, 'User').throws();
    const response = await request(app)
      .post('/api/v1/cargar')
      .expect('Content-Type', /json/)
      .expect(500);
    expect(response.body).toEqual({
      error: true,
      msg: expect.any(String),
    });
    db.User.restore();
  });

});
