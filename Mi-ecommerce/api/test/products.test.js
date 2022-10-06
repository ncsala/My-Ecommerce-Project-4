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

    test('debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
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

describe('/products?category=category_id GET',()=>{

    test('/products?category=categoria devolver un status 200 y con el formato json correcto',async ()=>{
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
    
    test('debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
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

    test('debe devolver status 404 y un json con error:true si se manda una categoria que no tiene productos',async ()=>{
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
    
    test('deve devolver un status 500 si se da un error interno',async ()=>{
    
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

    test('/products/search?q=man debe devolver un status 200 y con el formato json correcto',async ()=>{
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

    test('/products/search?q=man debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
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

    test('deve devolver un status 500 si se da un error interno',async ()=>{
    
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
    test('/products/2 debe devolver un status 200 y con el formato json correcto',async ()=>{
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

    test('/products/2 debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
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

    test('/products/18 debe devolver status 404 y un json con error:true si se da un product_id que no existe',async ()=>{
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

    test('deve devolver un status 500 si se da un error interno',async ()=>{
    
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
    test('/products/2 debe devolver un status 200 y con el formato json correcto',async ()=>{
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

    test('/products/mostwanted debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
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

    test('deve devolver un status 500 si se da un error interno',async ()=>{
    
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
    test('/poducts debe retornar statusCode 200 y el producto creado en la data de su respuesta, ademas del formato correcto de jso',async ()=>{
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

    test('/products debe retornar statusCode 400 y error en true si no se pasa el precio o el titulo',async ()=>{
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

    test('/products debe retornar statusCode 401 y error en true si no tenes permisos',async ()=>{
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

    test('/products debe retornar un 404 si se envia un category_id que no existe en el sistema',async ()=>{
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

    test('deve devolver un status 500 si se da un error interno',async ()=>{
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

    test('/products/:id debe retornar statusCode 200 si el producto se elimina correctamente',async ()=>{
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

    test('/products/:id debe retornar statusCode 400 si el producto esta en algun cart',async ()=>{
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

    test('/products debe retornar statusCode 401 y error en true si no tenes permisos',async ()=>{
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

    test('/products/:id debe retornar statusCode 404 si el producto ',async ()=>{
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

    test('deve devolver un status 500 si se da un error interno',async ()=>{
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
    test('/products/5 debe retornar 401 y error true si se manda un token que no tiene permisos',async ()=>{
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

    test('/products/11 debe retornar 404 si se manda un product_id de un producto que no existe',async ()=>{
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

    test('/products/5 debe retornar 400 si se manda un category en el body de una categoria que no existe',async ()=>{
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

    test('/products/5 debe retornar 200 ,error:false y el formato correcto de json si se moifica correctamente',async ()=>{
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

    test('/products/5 debe retornar 500 si eiste un error interno',async ()=>{
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

    test('/products/7/pictures debe devolver un status 200 y con el formato json correcto',async ()=>{
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

    test('debe devolver status 401 y un json con error:true si se da token erroneo',async ()=>{
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

    test('deve devolver un status 500 si se da un error interno',async ()=>{

        const stub = await sinon.stub(db.Product, 'findAll').throws();
        const token = await generateToken('god');

        let res = await request(app).get('/api/v1/products/7/pictures').auth(token,{type:'bearer'});

        expect(res.body).toEqual(expect.objectContaining({
            error:true,
            msg:expect.any(String)
        }))

        stub.restore();
    
    })

    test('/products/16/pictures debe devolver un status 404 porque no existe el product_id 16',async ()=>{
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

    test('/products/8/pictures debe devolver un status 404 porque el product_id 8 no tiene imagenes',async ()=>{
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



