const { app } = require("../../server.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');

const {
	generateToken,
	cargarDatos,
} = require('./helpers');

const { Op } = require("sequelize");


beforeAll(async () => {

    await cargarDatos()
});

describe('/category GET',()=>{
    test("must return a status 200 and with the correct json format", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).get('/api/v1/category').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
	});

	const newCategory ={
		name:"hielo1424"
	}

	test("devolver status 201 al crear una categoria", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).post('/api/v1/category').auth(token,{type:'bearer'}).send(newCategory);
        expect(res.statusCode).toBe(201);
	});
});