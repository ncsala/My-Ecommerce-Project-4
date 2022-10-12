const { app } = require("../../app.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');

const {
	generateToken,
	loadingDataInTestingDB,
} = require('./helpers');

const { Op } = require("sequelize");


beforeAll(async () => {
	await db.sequelize.sync({ force: true });
	await loadingDataInTestingDB();
	// await cargarDatos();
});
//test de devover categorias (GET)
describe('/category GET',()=>{
    test("should return all categories with status 200", async ()=>{
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

	test("must return a status 500 if there is an error on the server ", async ()=>{
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
		name:"Congelados"
	};
	const oldCategory ={
		name:"Ropa y Calzados"
	}
	
	const oldCategory1 ={
		name:"Articulos de cocina"
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
			category_name: "Congelados"
			})
		);
	});

	test("must return a status 400 if Category already exist", async ()=>{
		const token = await generateToken('god');
		const res = await request(app)
		.post('/api/v1/category')
		.auth(token,{type:'bearer'})
		.send(oldCategory);
        expect(res.statusCode).toBe(400);
	});
	test('must return a statusCode 401 if your user is not allowed to delete a category',async ()=>{
		const token = await generateToken('guest');
		const res = await request(app)
		.post('/api/v1/category')
		.auth(token,{type:'bearer'})
		.send(oldCategory1);
        expect(res.statusCode).toBe(401);

	});
	test("must return a status 500 if there is an error on the server ", async ()=>{
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
	test("must return a status 200 with new catergory category modified", async ()=>{
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

	test("must return a status 500  if there is an error on the server", async ()=>{
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
test("must return a status 200 and delete the category", async ()=>{
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
test('must return a statusCode 401 if your user is not allowed to delete a category',async ()=>{
	const token = await generateToken('guest');
	const res = await request(app)
	.delete('/api/v1/category/2')
	.auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(401);
});
test("must return a status 404 and catery not found", async ()=>{
	const token = await generateToken('god');
	const res = await request(app)
	.delete('/api/v1/category/17777')
	.auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(404);
});
});

test("must return a status 500 if there is an error on the server", async ()=>{
	const token = await generateToken('god');
	const stub = await sinon.stub(db.Category, 'destroy').throws();
	const res = await request(app)
	.delete('/api/v1/category/3')
	.auth(token,{type:'bearer'});
	expect(res.statusCode).toBe(500);
	stub.restore();
});

});