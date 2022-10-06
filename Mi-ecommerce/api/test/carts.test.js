const request = require('supertest');
const {app} = require('../../server');
const db = require('../database/models');
const { cargarDatos, generateToken, generateTokenWithId } = require('./helpers');



beforeAll(async ()=>{
    // await db.sequelize.sync({force:true})
    await cargarDatos()
})

describe('Get /cart/:id', () => {

    // afterEach(() => {
    //     server.close();
    // });

    test('Must return the cart of user number one using role "admin" status 200', async () =>{
        const token = await generateToken('admin');
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(200);


        res.body.data.forEach(element => {
            expect(element).toEqual(expect.objectContaining({
                product_id: expect.any(Number),
                quantity: expect.any(Number),
                createdAt: expect.any(String),
                createdAt: expect.any(String)
            }))
            expect(element.product_id).toBeGreaterThan(0);
            expect(element.quantity).toBeGreaterThanOrEqual(0);
            
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
                createdAt: expect.any(String)
            }))
            expect(element.product_id).toBeGreaterThan(0);
            expect(element.quantity).toBeGreaterThanOrEqual(0);
            
        });



    })
    test.skip('Must return the cart of user number one using role "guest" status 200', async () =>{
        const token = await generateTokenWithId('guest');
        const res =  await request(app).get('/api/v1/carts/1').auth(token, {type: 'bearer'});
        //expect(res.statusCode).toBe(200);
        console.log()
        const id = 1;
        expect(id).toEqual(1);
        
        res.body.data.forEach(element => {
            expect(element).toEqual(expect.objectContaining({
                product_id: expect.any(Number),
                quantity: expect.any(Number),
                createdAt: expect.any(String),
                createdAt: expect.any(String)
            }))
            expect(element.product_id).toBeGreaterThan(0);
            expect(element.quantity).toBeGreaterThanOrEqual(0);
            
        });



    })

    test('Must return the cart of user number one using role "god" status 404', async () =>{
        const token = await generateToken('god');
        const res =  await request(app).get('/api/v1/carts/10').auth(token, {type: 'bearer'});
        expect(res.statusCode).toBe(404);


    })

})