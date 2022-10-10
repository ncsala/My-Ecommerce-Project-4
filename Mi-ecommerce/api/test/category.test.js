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
//test de devover categorias (GET)
describe('/category GET',()=>{
    test("must return a status 200 and with the correct json format", async ()=>{
		const token = await generateToken('god');
		const res = await request(app)
		.get('/api/v1/category')
		.auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
		let data = res.body.data;
		data.forEach((elemen)=>{
			expect(elemen).toEqual(expect.objectContaining({
				category_id: expect.any(Number),
				category_name: expect.any(String),				
			 }));
			 expect(elemen.category_id).toBeGreaterThan(0);
			
		});
	});

	test("must return a status 500 and with error", async ()=>{
		const token = await generateToken('god');
		const stub =   sinon.stub(db.Category, 'findAll').throws();
		
		const res = await request(app)
		.get('/api/v1/category')
		.auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(500);

		stub.restore();
	});

	
//Test create category POST
describe('/category POST',()=>{
	const newCategory ={
		name:"hielo1424"
	};
	const oldCategory ={
		name:"Ropa y Calzados"
	}
	
	const oldCategory1 ={
		name:"Ropas y Calzados"
	}
	test("must return a status 201 and with the new category", async ()=>{
		const token = await generateToken('god');
		const res = await request(app)
		.post('/api/v1/category')
		.auth(token,{type:'bearer'})
		.send(newCategory);
        expect(res.statusCode).toBe(201);
		const Categ = await db.Category.findOne({
			where: { category_id: res.body.data.category_id },
		});
        expect(Categ).toEqual(expect.objectContaining({
			category_name: "hielo1424"
			})
		);
	});

	test("must return a status 400 and a error", async ()=>{
		const token = await generateToken('god');
		const res = await request(app)
		.post('/api/v1/category')
		.auth(token,{type:'bearer'})
		.send(oldCategory);
        expect(res.statusCode).toBe(400);
	});

	test("must return a status 500 and with the new category", async ()=>{
		const token = await generateToken('god');
		const stub = await sinon.stub(db.Category, 'create').throws();
		const res = await request(app)
		.post('/api/v1/category')
		.auth(token,{type:'bearer'})
		.send(oldCategory1);
        expect(res.statusCode).toBe(500);
		stub.restore();
	});
});
	

//Test modificar categoria PUT

describe('/category PUT',()=>{
const newcategorymodif = {
	name:"bebida"
}
	test("must return a status 200 and with new catergory category modified", async ()=>{
		const token = await generateToken('god');
		const res = await request(app)
		.put('/api/v1/category/1')
		.auth(token,{type:'bearer'})
		.send(newcategorymodif);
        expect(res.statusCode).toBe(200);
		const Categ = await db.Category.findOne({
			where: { category_id: res.body.data.category_id },
		});
        expect(Categ).toEqual(expect.objectContaining({
			category_name: "bebida"
			})
		);
	});

	test("must return a status 404 and catery not found", async ()=>{
		const token = await generateToken('god');
		const res = await request(app)
		.put('/api/v1/category/1111')
		.auth(token,{type:'bearer'})
		.send(newcategorymodif);
        expect(res.statusCode).toBe(404);
	});

	test("must return a status 500 and a error", async ()=>{
		const token = await generateToken('god');
		const stub = await sinon.stub(db.Category, 'update').throws();
		const res = await request(app)
		.put('/api/v1/category/1')
		.auth(token,{type:'bearer'})
		.send(newcategorymodif);
        expect(res.statusCode).toBe(500);
		stub.restore();
	});
});

//Test eliminar categorias DELETE

describe('/category DELETE',()=>{
test("must return a status 200 and delete de category", async ()=>{
	const token = await generateToken('god');
	const res = await request(app)
	.delete('/api/v1/category/1')
	.auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(200);
	const Categ = await db.Category.findOne({
		where: { category_id: res.body.data.category_id },
	});
	expect(Categ).toBe(null);
});

test("must return a status 404 and error", async ()=>{
	const token = await generateToken('god');
	const res = await request(app)
	.delete('/api/v1/category/17777')
	.auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(404);
});
});

test("must return a status 500 and a error ", async ()=>{
	const token = await generateToken('god');
	const stub = await sinon.stub(db.Category, 'destroy').throws();
	const res = await request(app)
	.delete('/api/v1/category/3')
	.auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(500);
	stub.restore();
});

});