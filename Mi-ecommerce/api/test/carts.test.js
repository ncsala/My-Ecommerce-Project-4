const { response } = require('express');
const request = require('supertest');
const {app} = require('../../server');
const db = require('../database/models');
const { loadingDataInTestingDB, generateToken, generateTokenWithId } = require('./helpers');
const sinon = require('sinon');



beforeAll(async () => {
	await db.sequelize.sync({ force: true });
	await loadingDataInTestingDB();
	// await cargarDatos();
});
describe('Get /cart/:id', () => {

    test('Must return the cart of user number one using role "admin" status 200', async () =>{
        const token = await generateToken('admin');
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(200);


        res.body.data.forEach(element => {
            expect(element).toEqual(expect.objectContaining({
                product_id: expect.any(Number),
                quantity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }))
            expect(element.product_id).toBeGreaterThan(0);
            expect(element.quantity).toBeGreaterThan(0);
            
        });



    })
    test('Must return the cart of user number one using role "god" status 200', async () =>{
        const token = await generateToken('god');
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(200);

        res.body.data.forEach(element => {
            expect(element).toEqual(expect.objectContaining({
                product_id: expect.any(Number),
                quantity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }))
            expect(element.product_id).toBeGreaterThan(0);
            expect(element.quantity).toBeGreaterThan(0);
            
        });



    })
    test('Must return the cart of user number one using role "guest" status 200', async () =>{
        const token = await generateTokenWithId('guest', 1);
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(200);
 
        
        res.body.data.forEach(element => {
            expect(element).toEqual(expect.objectContaining({
                product_id: expect.any(Number),
                quantity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }))
            expect(element.product_id).toBeGreaterThan(0);
            expect(element.quantity).toBeGreaterThan(0);
            
        });



    })

    test("Must return error 403 when trying to show another guest's cart", async () =>{
        const token = await generateTokenWithId('guest', 2);
        const user = {
            username: 'nico',
            password: 'hola'
        }
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(403);
    })

    test('Must return error status 404 cart does not exist', async () =>{
        const token = await generateToken('god');
        const res =  await request(app).get('/api/v1/carts/10').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(404);
    })

    test('Must return error status 404 cart does not exist', async () =>{
        const token = await generateToken('god');
        const res =  await request(app).get('/api/v1/carts/10').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(404);
    })

    test('Must return error Ístatus 500 when there is a server error', async () =>{
        const token = await generateToken('god');
        const stub = sinon.stub(db.cart_product, 'findAll').throws();
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(500);
        stub.restore();
    })
})


//PUT 
describe('PUT /carts/id', () => {

    //Success
    test("Must insert a new product into a user's cart and return status 200 & the user's updated cart ", async() => {
        const token = await generateToken('god');
        const newData = {
            id: 20,
            quantity: 1
        }
        const original = await db.cart_product.findAll({
            where:{
                cart_id: 1
            }
        })
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(200);
        res.body.data.forEach(element => {
          expect(element).toEqual(expect.objectContaining({
            product_id: expect.any(Number),
            quantity: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        }))
        expect(element.product_id).toBeGreaterThan(0);
        expect(element.quantity).toBeGreaterThan(0);
        })
        const confirm = await db.cart_product.findAll({
            where:{
                cart_id: 1
        }})
        expect(confirm).toHaveLength(original.length + 1);
    })

    test("Must insert a new product into a user's cart and return status 200 & the user's updated cart ", async() => {
        const token = await generateTokenWithId('guest', 1);
        const newData = {
            id: 5,
            quantity: 1
        }
        const original = await db.cart_product.findAll({
            where:{
                cart_id: 1
            }
        })
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(200);
        res.body.data.forEach(element => {
          expect(element).toEqual(expect.objectContaining({
            product_id: expect.any(Number),
            quantity: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        }))
        expect(element.product_id).toBeGreaterThan(0);
        expect(element.quantity).toBeGreaterThan(0);
        })
        const confirm = await db.cart_product.findAll({
            where:{
                cart_id: 1
        }})
        expect(confirm).toHaveLength(original.length + 1);
    })

    test("Must insert a new product into a user's cart and return status 200 & the user's updated cart ", async() => {
        const token = await generateTokenWithId('admin', 1);
        const newData = {
            id: 19,
            quantity: 1
        }
        const original = await db.cart_product.findAll({
            where:{
                cart_id: 1
            }
        })
        
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(200);
        res.body.data.forEach(element => {
          expect(element).toEqual(expect.objectContaining({
            product_id: expect.any(Number),
            quantity: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        }))
        expect(element.product_id).toBeGreaterThan(0);
        expect(element.quantity).toBeGreaterThan(0);
        })
        const confirm = await db.cart_product.findAll({
            where:{
                cart_id: 1
        }})
        expect(confirm).toHaveLength(original.length + 1);
    })

    test("Must insert an existing product into a user's cart and return status 200 & the user's updated cart ", async() => {
        const token = await generateToken('god');
        const newData = {
            id: 19,
            quantity: 1
        }
        const original = await db.cart_product.findAll({
            where:{
                cart_id: 1
            }
        })
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(200);
        res.body.data.forEach(element => {
          expect(element).toEqual(expect.objectContaining({
            product_id: expect.any(Number),
            quantity: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        }))
        expect(element.product_id).toBeGreaterThan(0);
        expect(element.quantity).toBeGreaterThan(0);
        })
        const confirm = await db.cart_product.findAll({
            where:{
                cart_id: 1
        }})
        expect(confirm).toHaveLength(original.length);
    })


    // Errors
    test("Must return status 400 when the new quantity is less than 0 ", async() => {
        const token = await generateToken('god');
        const newData = {
            id: 4,
            quantity: -100
        }
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(400);
        const data = await db.cart_product.findOne({where: {product_id: 4, cart_id: 1}})
    })

    test("Must return error 404 when cart does not exist ", async() => {
        const token = await generateToken('god');
        const newData = {
            id: 4,
            quantity: 1
        }
        const res = await request(app).put('/api/v1/carts/10').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(404);
        const cart = await db.Cart.findOne({where:{cart_id:10}})
        expect(cart).toBeNull();

    })

    test("Must return error 404 when product does not exist ", async() => {
        const token = await generateToken('god');
        const newData = {
            id: 400,
            quantity: 1
        }
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(404);
        const product = await db.Product.findOne({where:{product_id:400}})
        expect(product).toBeNull();

    })

    test("Must return error 404 when there is not enough stock ", async() => {
        const token = await generateToken('god');
        const newData = {
            id: 4,
            quantity: 1000
        }
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'})
                    .send(newData)
                    .expect(404);
        const product = await db.Product.findOne({where:{product_id:4}})
        expect(product.dataValues.stock).toBeLessThan(newData.quantity);
    })

    test("Must return error 403 when trying to edit another user's cart ", async() => {
        const token = await generateToken('admin');
        const newData = {
            id: 4,
            quantity: 1
        }
        const res = await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'}).send(newData);
        expect(res.statusCode).toBe(403);

    })
    test('Must return error status 500 when there is a server error', async () =>{
        const token = await generateToken('god');      
        const newData = {
            id: 4,
            quantity: 1
        }
        const stub = sinon.stub(db.cart_product, 'findAll').throws();
        const res =  await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'}).send(newData);
        expect(res.statusCode).toBe(500);
        stub.restore();
    })
    test("Must return error 403 when trying to edit another guest's cart as a guest", async () =>{
        const token = await generateTokenWithId('guest', 2);
        const newData = {
            id: 4,
            quantity: 1
        }
        const res =  await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'}).send(newData);
        expect(res.statusCode).toBe(403);
    })
    test("Must return error 403 when trying to show another guest's cart as admin", async () =>{
        const token = await generateTokenWithId('admin', 2);
        const newData = {
            id: 4,
            quantity: 1
        }
        const res =  await request(app).put('/api/v1/carts/1').auth(token, {type: 'bearer'}).send(newData);
        expect(res.statusCode).toBe(403);
    })
})