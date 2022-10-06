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
//devover categorias
describe('/category GET',()=>{
    test("must return a status 200 and with the correct json format", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).get('/api/v1/category').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
	});

	test("must return a status 500 and with error", async ()=>{
		const token = await generateToken('god');
		const stub =   sinon.stub(db.Category, 'findAll').throws();
		
		const res = await request(app).get('/api/v1/category').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(500);

		stub.restore();
	});

	const newCategory ={
		name:"hielo1424"
	};
	const oldCategory ={
		name:"Ropa y Calzados"
	}
	
	const oldCategory1 ={
		name:"Ropas y Calzados"
	}
//create category
describe('/category POST',()=>{
	test("must return a status 201 and with the new category", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).post('/api/v1/category').auth(token,{type:'bearer'}).send(newCategory);
        expect(res.statusCode).toBe(201);
	});

	test("must return a status 400 and a error", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).post('/api/v1/category').auth(token,{type:'bearer'}).send(oldCategory);
        expect(res.statusCode).toBe(400);
	});

	test("must return a status 500 and with the new category", async ()=>{
		const token = await generateToken('god');
		const stub = await sinon.stub(db.Category, 'create').throws();
		const res = await request(app).post('/api/v1/category').auth(token,{type:'bearer'}).send(oldCategory1);
        expect(res.statusCode).toBe(500);
		stub.restore();
	});
});
	

//modificar categoria

describe('/category PUT',()=>{
const newcategorymodif = {
	name:"bebida"
}
	test("must return a status 200 and with new catergory category modified", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).put('/api/v1/category/1').auth(token,{type:'bearer'}).send(newcategorymodif);
        expect(res.statusCode).toBe(200);
	});

	test("must return a status 404 and catery not found", async ()=>{
		const token = await generateToken('god');
		const res = await request(app).put('/api/v1/category/1111').auth(token,{type:'bearer'}).send(newcategorymodif);
        expect(res.statusCode).toBe(404);
	});

	test("must return a status 500 and a error", async ()=>{
		const token = await generateToken('god');
		const stub = await sinon.stub(db.Category, 'update').throws();
		const res = await request(app).put('/api/v1/category/1').auth(token,{type:'bearer'}).send(newcategorymodif);
        expect(res.statusCode).toBe(500);
		stub.restore();
	});
});

//eliminar categorias

describe('/category DELETE',()=>{
test("must return a status 200 and delete de category", async ()=>{
	const token = await generateToken('god');
	const res = await request(app).delete('/api/v1/category/1').auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(200);
});

test("must return a status 404 and error", async ()=>{
	const token = await generateToken('god');
	const res = await request(app).delete('/api/v1/category/17777').auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(404);
});
});

test("must return a status 500 and a error ", async ()=>{
	const token = await generateToken('god');
	const stub = await sinon.stub(db.Category, 'destroy').throws();
	const res = await request(app).delete('/api/v1/category/3').auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(500);
	stub.restore();
});

});