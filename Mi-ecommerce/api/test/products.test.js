const { server,app } = require("../../server.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');
const {
	generateToken,
	loadingDataInTestingDB,
	destroyTables,
} = require('./helpers');
const { STRING } = require("sequelize");
const { boolean } = require("joi");

afterAll(() => {
});

afterEach(() => {
	server.close();
});

beforeAll(async () => {
	await db.sequelize.sync({ force: true });
	await loadingDataInTestingDB();
});

describe('/products GET',()=>{
    test('/products debe devolver un status 200 y con el formato json correcto',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: expect.any(Boolean),
                msg:expect.any(String),
            }
        ))
    })
})


