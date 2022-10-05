const { app } = require("../../server.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');

const {
	generateToken,
//	loadingDataInTestingDB,
} = require('./helpers');

//const { Op } = require("sequelize");

describe('/category GET',()=>{
    test("debe devolver status 200", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).get('/api/v1/category').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
	
	});
});