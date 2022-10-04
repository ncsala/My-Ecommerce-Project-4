const { app } = require("../../server.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');

const {
	generateToken,
	loadingDataInTestingDB,
    cargarDatos,
    limpiarBdTest
} = require('./helpers');
const { Op } = require("sequelize");

beforeAll(async () => {
	// await db.sequelize.sync({ force: true });    
    await cargarDatos()
	// await loadingDataInTestingDB();
});

describe('/products GET',()=>{
    // afterEach(() => {
    //     server.close();
    // });

    test('/products debe devolver un status 200 y con el formato json correcto',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:expect.any(String),
            }
        ))
        let data = res.body.data

        data.forEach(element => {
            expect(element).toEqual(expect.objectContaining({
                category_name:expect.toBeOneOf([expect.any(String),null]),
                price:expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                stock:expect.any(Number),
                product_id:expect.any(Number),
                mostwanted: expect.toBeOneOf([1,0]),
                gallery:expect.toBeOneOf([expect.arrayContaining([expect.objectContaining({
                    picture_id: expect.any(Number),
                    picture_url: expect.any(String),
                    picture_description: expect.toBeOneOf([expect.any(String),null]),
                    product_id:expect.any(Number)
                })]),[]])
                
            }))
            expect(element.product_id).toBeGreaterThan(0)
            expect(parseFloat(element.price)).toBeGreaterThan(0);
        });
    })

    test.skip('debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
        const token = await generateToken('guest');
        let res = await request(app).get('/api/v1/products').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))
    })

    test('deve devolver un status 500 si se da un error interno',async ()=>{

        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');

        let res = await request(app).get('/api/v1/products').auth(token,{type:'bearer'});

        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))

        stub.restore();
    
    })

    
})


