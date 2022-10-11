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

describe('/products GET',()=>{
    // afterEach(() => {
    //     server.close();
    // });

    test('/products  must return a status 200 and with the correct json format',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products').auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"All products",
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
    test( 'must return a statusCode 401 , in the json respone , must be an error attribute with the value true, and a data attribute with the correct format'
    ,async ()=>{
        const token = await generateToken('g');
        let res = await request(app).get('/api/v1/products').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:'you have to log in in order to see the products',
            }
        ))
    })

    test('Must return a statusCode 500 if there is an internal error',async ()=>{

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

describe('/products?category=category_id GET',()=>{

    test('/products?category=categoria must return a statusCode 200 and the correct json format',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products?category=2').auth(token,{type:'bearer'});
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Products by category",
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

    test('must return a statusCode 401 and an error:true in the json response if you send an incorrect json',async ()=>{
        const token = await generateToken('g');
        let res = await request(app).get('/api/v1/products?category=2').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))
    })

    test('must return a statusCode 404 and an error:true in the json respose if any product has the category_id assignated',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products?category=4').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"Doesn't exist products with this category",
            }
        ))
    })
    
    test('must return a statusCode 500 if there is an internal error',async ()=>{
    
        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');
    
        let res = await request(app).get('/api/v1/products?category=2').auth(token,{type:'bearer'});
    
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))
    
        stub.restore();
    
    })
})

describe('/products/search?q=busqueda GET',()=>{

    test('/products/search?q=man must return a statusCode 200 and the correct json format',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/search?q=man').auth(token,{type:'bearer'});
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Products filtered",
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

    test('/products/search?q=man must return a statusCode 401 and an error:true in the json response if the token sent is wrong',async ()=>{
        const token = await generateToken('g');
        let res = await request(app).get('/api/v1/products/search?q=man').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))
    })

    test('must return an statusCode 500 if there is an internal error',async ()=>{
    
        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');
    
        let res = await request(app).get('/api/v1/products/search?q=man').auth(token,{type:'bearer'});
    
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))
    
        stub.restore();
    
    })
})

describe('/products/:id GET',()=>{
    test('/products/2 must return a statusCode 200 and the correct json format',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/2').auth(token,{type:'bearer'});
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Product detail",
            }
        ))
        
            expect(res.body.data).toEqual(expect.objectContaining({
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
                
            })
            )
            expect(res.body.data.product_id).toBeGreaterThan(0)
            expect(parseFloat(res.body.data.price)).toBeGreaterThan(0);
        
    })

    test('/products/2 must return a 401 statusCode and an error:true in the json respone if the token sent is wrong',async ()=>{
        const token = await generateToken('g');
        let res = await request(app).get('/api/v1/products/2').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))
    })

    test('/products/18 must return a 404 statusCode and an error:true in the json response if the product_id sent does not exist',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/18').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"Product not found",
            }
        ))
    })

    test('must return a statusCode 500 if there is an internal error',async ()=>{
    
        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');
    
        let res = await request(app).get('/api/v1/products/2').auth(token,{type:'bearer'});
    
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))
    
        stub.restore();
    
    })
})

describe('/products/mostwanted GET',()=>{
    test('/products/2 must return a statusCode 200 and the correct json format',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/mostwanted').auth(token,{type:'bearer'});
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Most wanted products",
            }
        ))
        let data = res.body.data;
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

    test('/products/mostwanted must return a statusCode 401 and an error:true if the token sent is wrong',async ()=>{
        const token = await generateToken('g');
        let res = await request(app).get('/api/v1/products/mostwanted').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))
    })

    test('must return a statusCode 500 if there is an internal error',async ()=>{
    
        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');
    
        let res = await request(app).get('/api/v1/products/mostwanted').auth(token,{type:'bearer'});
    
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))
    
        stub.restore();
    
    })
})

describe('/products POST',()=>{
    
    test('/poducts must return a statusCode 200 and the correct json format with the data of the created product',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).post('/api/v1/products')
        .auth(token,{type:'bearer'})
        .send({title:"fruta maracuya",price:140,mostwanted:true,description:"muy rica fruta",stock:80});
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Product created",
            }
        ))

        expect(res.body.data).toEqual(expect.objectContaining({
            category_id:expect.toBeOneOf([expect.any(Number),null]),
            price:expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            stock:expect.any(Number),
            product_id:expect.any(Number),
            mostwanted: expect.toBeOneOf([true,false])
        })
        )
        expect(res.body.data.product_id).toBeGreaterThan(0)
        expect(parseFloat(res.body.data.price)).toBeGreaterThan(0);

    })

    test('/products must return a statusCode 400 and an error:true in the response if the price or the title are undefined',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).post('/api/v1/products')
        .auth(token,{type:'bearer'})
        .send({title:"fruta maracuya"});

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))

    })

    test('/products must return a statusCode 401 if your user is not allowed to create a product',async ()=>{
        const token = await generateToken('guest');
        let res = await request(app).post('/api/v1/products')
        .auth(token,{type:'bearer'})
        .send({title:"fruta maracuya",price:150});

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))

    })

    test('/products must return a 404 if you sent an incorrect category_id',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).post('/api/v1/products')
        .auth(token,{type:'bearer'})
        .send({title:"fruta maracuya",price:150,category:10});

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))

    })

    test('must return a statusCode 500 if there is an internal error',async ()=>{
        const stub = await sinon.stub(db.Product, 'create').throws();

        const token = await generateToken('god');
        let res = await request(app).post('/api/v1/products')
        .auth(token,{type:'bearer'})
        .send({title:"fruta maracuya",price:150,category:3});

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))

        stub.restore();
    
    })
})

describe('/products/:id DELETE',()=>{

    test('/products/:id must return a statusCode 200 if the product is deleted correctly',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).delete('/api/v1/products/4')
        .auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Product deleted",
            }
        ))

        expect(res.body.data).toEqual(expect.objectContaining({
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
            
        })
        )
        expect(res.body.data.product_id).toBeGreaterThan(0)
        expect(parseFloat(res.body.data.price)).toBeGreaterThan(0);


    })

    test('/products/:id must return a statusCode 400 if the product you are trying to delete is included in some carts',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).delete('/api/v1/products/2')
        .auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"Product with id = 2 is included in some carts, delete it from the carts in order to delete the product",
            }
        ))
    })

    test('/products must return a statusCode 401 if you are not allowed to do this action',async ()=>{
        const token = await generateToken('guest');
        let res = await request(app).delete('/api/v1/products/1')
        .auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))

    })

    test('/products/:id must return a statusCode 404 if there isnt any product with the id sent in params',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).delete('/api/v1/products/10')
        .auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(404)
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"Product not found",
            }
        ))

    })

    test('must return a statusCode 500 if there is an internal error',async ()=>{
        const stub = await sinon.stub(db.Product, 'destroy').throws();

        const token = await generateToken('god');
        let res = await request(app).delete('/api/v1/products/1')
        .auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(500)
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))

        stub.restore();
    
    })
})

describe('/products/:id PUT',()=>{
    test('/products/5 must return a statusCode 401 if you havent enough permissions to do this actions',async ()=>{
        const token = await generateToken('guest');
        let res = await request(app).put('/api/v1/products/5')
        .auth(token,{type:'bearer'})
        .send({title:"shampoo Head & Shoulders"});

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:expect.any(String),
            }
        ))
    })

    test('/products/11 must return a 404 statusCode if there isnt any product with the id sent in params',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).put('/api/v1/products/11')
        .auth(token,{type:'bearer'})
        .send({title:"shampoo Head & Shoulders"});

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"Product with id = 11 does not exist",
            }
        ))
    })

    test('/products/5 must return a statusCode 400 if the category sent in the request body does not exist',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).put('/api/v1/products/5')
        .auth(token,{type:'bearer'})
        .send({title:"shampoo Head & Shoulders",category:5});

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"category with id = 5 does not exist",
            }
        ))
    })

    test('/products/5 must return a statusCode 200 and an error;false in the json response if the product is updated correctly',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).put('/api/v1/products/5')
        .auth(token,{type:'bearer'})
        .send({
            category:2,
            description:"shampoo expectacular",
            price:250,
            category:2,
            mostwanted:true,
            stock:44
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Product modified",
            }
        ))

        expect(res.body.data).toEqual(expect.objectContaining({
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
            
        })
        )
        expect(res.body.data.product_id).toBeGreaterThan(0)
        expect(parseFloat(res.body.data.price)).toBeGreaterThan(0);
    })

    test('/products/5 must return a 500 statusCode if there is an internal error',async ()=>{
        const stub = await sinon.stub(db.Product, 'update').throws();
        const token = await generateToken('god');
    
        let res = await request(app).put('/api/v1/products/5').auth(token,{type:'bearer'})
        .send({title:"aaaaaaaaaaaagua"});
    
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))
    
        stub.restore();
    })
    
})

describe('/products/:id/pictures GET',()=>{

    test('/products/7/pictures must return a statusCode 200 and the correct json format',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/1/pictures').auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: false,
                msg:"Product photo list",
            }
        ))
        let data = res.body.data

        data.forEach(element =>{
            expect.objectContaining({
                picture_id: expect.any(Number),
                picture_url: expect.any(String),
                picture_description: expect(element.picture_description).toBeOneOf([expect.any(String),null]),
                product_id: expect.any(Number),
            })

            expect(element.picture_id).toBeGreaterThan(0)
            expect(element.product_id).toBeGreaterThan(0)
        })
        
    })

    test('must return a 401 statusCode and an error:true in the json response if the token sent is wrong',async ()=>{
        const token = await generateToken('g');
        let res = await request(app).get('/api/v1/products/7/pictures').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:'you have to log in in order to see the products pictures',
            }
        ))
    })

    test('must return a statusCode 500 if there is an internal error',async ()=>{

        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');

        let res = await request(app).get('/api/v1/products/7/pictures').auth(token,{type:'bearer'});

        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))

        stub.restore();
    
    })

    test('/products/16/pictures must return a statusCode 404 if the product_id sent in params does not exist',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/16/pictures').auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"Product not found",
            }
        ))
        
    })

    test('/products/8/pictures must return a statusCode 404 becouse the product with id sent by params does not have pictures',async ()=>{
        const token = await generateToken('god');
        let res = await request(app).get('/api/v1/products/8/pictures').auth(token,{type:'bearer'});

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining(
            {
                error: true,
                msg:"The product does not have images",
            }
        ))
        
    })
})