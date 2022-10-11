const { app } = require("../../app.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');

const {
	generateToken,
    loadingDataInTestingDB,
    generateTokenWithId
} = require('./helpers');

const { Op } = require("sequelize");

beforeAll(async () => {

    await db.sequelize.sync({force: true})
    await loadingDataInTestingDB();
});

describe('/users',()=>{

    ////////////GET USERS

    test('/users must return status 200 as god and with a valid JSON format (user list)', 
        async () => {
            const token = await generateToken('god');
            let res = await request(app)
                .get('/api/v1/users')
                    .auth(token,{type:'bearer'});
            expect(res.statusCode)
                .toBe(200);
            expect(res.body)
                .toEqual(expect
                    .objectContaining(
                    {
                        error: false,
                        msg: 'Users list',
                    }
                ))

            const data = res.body.data;
            for (let element of data){
                expect(element)
                    .toEqual(expect
                        .objectContaining({
                            user_id: expect.any(Number),
                            first_name: expect.any(String),
                            last_name: expect.any(String),
                            username: expect.any(String),
                            email: expect.any(String),
                            role: expect.toBeOneOf(["god", "admin", "guest"]),
                            profilepic: expect.toBeOneOf([expect.any(String),null])
                        })
                    );
                expect(res.body.data).not.toContainKey('password');
        }
    })

    test('/users must return status 200 as admin and with a valid JSON format (user list)', 
        async () => {
            const token = await generateToken('admin');
            let res = await request(app)
                .get('/api/v1/users')
                    .auth(token,{type:'bearer'});
            expect(res.statusCode)
                .toBe(200);
            expect(res.body)
                .toEqual(expect
                    .objectContaining(
                    {
                        error: false,
                        msg: 'Users list',
                    }
                ))

            const data = res.body.data;
            for (let element of data){
                expect(element)
                    .toEqual(expect
                        .objectContaining({
                            user_id: expect.any(Number),
                            first_name: expect.any(String),
                            last_name: expect.any(String),
                            username: expect.any(String),
                            email: expect.any(String),
                            role: expect.toBeOneOf(["god", "admin", "guest"]),
                            profilepic: expect.toBeOneOf([expect.any(String),null])
                        })
                    );
                expect(res.body.data).not.toContainKey('password');
        }
    })

    test('/users must return status 403 as god and with a valid JSON format', 
        async () => {
            const token = await generateToken('guest');
            let res = await request(app)
                .get('/api/v1/users')
                    .auth(token,{type:'bearer'});
            expect(res.statusCode)
                .toBe(403);
            expect(res.body)
                .toEqual(expect
                    .objectContaining(
                    {
                        error: true,
                        msg: 'Not authorized',
                    }
                ))
    })

    test('/users must return status 500 when a server error ocurres', 
        async () => {
            const token = await generateToken('admin');
            const stub = sinon.stub(db.User, 'findAll').throws();
            let res = await request(app)
                .get('/api/v1/users')
                    .auth(token,{type:'bearer'});
            expect(res.statusCode)
                .toBe(500);
            expect(res.body)
                .toEqual(expect
                    .objectContaining(
                    {
                        error: true,
                    }
                ))
            stub.restore();
    })

    ////////////GET USER

    test('GET to /users/:id must return status 200 as god and with a valid JSON format (user requested)',
        async () => {
            const token = await generateToken('god');
            let res = await request(app)
                .get('/api/v1/users/1')
                    .auth(token,{type:'bearer'});
                    expect(res.statusCode)
                    .toBe(200);
            expect(res.body)
                .toEqual(expect
                    .objectContaining(
                    {
                        error: false,
                        msg: 'Detalle de usuario',
                    }
                ))
            
            expect(res.body.data)
                .toEqual(expect
                    .objectContaining({
                        user_id: expect.any(Number),
                        first_name: expect.any(String),
                        last_name: expect.any(String),
                        username: expect.any(String),
                        email: expect.any(String),
                        role: expect.toBeOneOf(["god", "admin", "guest"]),
                        profilepic: expect.toBeOneOf([expect.any(String),null])
                    })
                );
            expect(res.body.data).not.toContainKey('password');
    })

    test('GET to /users/:id must return status 200 as admin and with a valid JSON format (user requested)',
    async () => {
        const token = await generateToken('admin');
        let res = await request(app)
            .get('/api/v1/users/1')
                .auth(token,{type:'bearer'});
                expect(res.statusCode)
                .toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'Detalle de usuario',
                }
            ))
        
        expect(res.body.data)
            .toEqual(expect
                .objectContaining({
                    user_id: expect.any(Number),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    role: expect.toBeOneOf(["god", "admin", "guest"]),
                    profilepic: expect.toBeOneOf([expect.any(String),null])
                })
            );
        expect(res.body.data).not.toContainKey('password');
    })

    test('GET to /users/:id must return status 200 when guest user requesting own user data and with a valid JSON format (user requested)',
    async () => {
        const token = await generateTokenWithId('guest', 1);
        let res = await request(app)
            .get('/api/v1/users/1')
                .auth(token,{type:'bearer'});
                expect(res.statusCode)
                .toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'Detalle de usuario',
                }
            ))
        
        expect(res.body.data)
            .toEqual(expect
                .objectContaining({
                    user_id: expect.any(Number),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    username: expect.any(String),
                    email: expect.any(String),
                    role: expect.toBeOneOf(["god", "admin", "guest"]),
                    profilepic: expect.toBeOneOf([expect.any(String),null])
                })
            );
        expect(res.body.data).not.toContainKey('password');
    })

    test('GET to /users/:id must return status 403 when guest user requesting no their own user data and with a valid JSON format',
    async () => {
        const token = await generateTokenWithId('guest', 2);
        let res = await request(app)
            .get('/api/v1/users/1')
                .auth(token,{type:'bearer'});
                expect(res.statusCode)
                .toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: 'Not authorized',
                }
            ))
    })
    
    test('GET to /users/:id must return 404 when user is not found',
        async () => {
            const token = await generateToken('god');
            let res = await request(app)
                .get('/api/v1/users/30')
                    .auth(token,{type:'bearer'});
                    expect(res.statusCode)
                    .toBe(404);
            expect(res.body)
                .toEqual(expect
                    .objectContaining(
                    {
                        error: true,
                        msg: 'User does not exists.',
                    }
                ))
    })

    test('GET to /users/:id must return status 500 when a server error ocurres', 
    async () => {
        const token = await generateToken('admin');
        const stub = sinon.stub(db.User, 'findByPk').throws();
        let res = await request(app)
            .get('/api/v1/users/1')
                .auth(token,{type:'bearer'});
        expect(res.statusCode)
            .toBe(500);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                }
            ))
        stub.restore();
    })

    ////////////CREATE USER

    test('POST to /user must return 201, create and return user created', async () => {
        const res = await request(app)
            .post('/api/v1/users')
            .send({
                "email": "nuevousuario@gmail.com",
                "username": "nuevo",
                "password": "hola",
                "firstname": "Nuevo",
                "lastname": "Usuario",
                "role": "guest",
                "profilepic": "https://imageurl.com/image.jpg"
            })

        expect(res.statusCode).toBe(201);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User created successfully',
                    data: expect
                            .objectContaining(
                                {
                                    user_id: expect.any(Number),
                                    first_name: "Nuevo",
                                    last_name: "Usuario",
                                    username: "nuevo",
                                    email: "nuevousuario@gmail.com",
                                    role: "guest",
                                    profilepic: "https://imageurl.com/image.jpg"
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        

        const userCreated = await db.User.findOne({
            where:{
                username: "nuevo"
            }
        })

        expect(userCreated)
            .toEqual(expect
                .objectContaining(
                {
                    user_id: expect.any(Number),
                    first_name: "Nuevo",
                    last_name: "Usuario",
                    username: "nuevo",
                    email: "nuevousuario@gmail.com",
                    role: "guest",
                    password: expect.any(String),
                    profilepic: "https://imageurl.com/image.jpg"
                })
            )   
    })

    test('POST to /users must return 400, when username is already registred and return valid JSON', async () => {
        const res = await request(app)
            .post('/api/v1/users')
            .send({
                "email": "nuevousuario@gmail.com",
                "username": "nico",
                "password": "hola",
                "firstname": "Nuevo",
                "lastname": "Usuario",
                "role": "guest",
                "profilepic": "https://imageurl.com/image.jpg"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: 'Username is already registred', 
                }
            )) 
    })

    test('POST to /users must return 400, when email is already being used and return valid JSON', async () => {
        const res = await request(app)
            .post('/api/v1/users')
            .send({
                "email": "nico@gmail.com",
                "username": "nuevo",
                "password": "hola",
                "firstname": "Nuevo",
                "lastname": "Usuario",
                "role": "guest",
                "profilepic": "https://imageurl.com/image.jpg"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: 'E-mail is already registred', 
                }
            )) 
    })

    test('POST to /users must return status 500 when a server error ocurres', 
    async () => {
        const stub = sinon.stub(db.User, 'create').throws();
        let res = await request(app)
            .post('/api/v1/users/')
            .send({
                "email": "nuevousuario2@gmail.com",
                "username": "nuevo2",
                "password": "hola",
                "firstname": "Nuevo",
                "lastname": "Usuario",
                "role": "guest"
            })
        expect(res.statusCode)
            .toBe(500);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                }
            ))
        stub.restore();
    })

    ////////////LOGIN USER

    test('POST to /user/login must return 200, and return valid JSON', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send(
                {
                    "username": "feli",
                    "password": "hola"
                })

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    "error": false,
                    "msg": "authorized",
                    "data": {
                        "idUser": 5,
                        "username": "feli"
                    },
                    "token": expect.any(String)
                })
            )
        expect(res.body.data).not.toContainKey('password');
    })
    
    test('POST to /user/login must return 401 when wrong username, and return valid JSON', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send(
                {
                    "username": "felii",
                    "password": "hola"
                })

        expect(res.statusCode).toBe(401);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error:true,
                    msg: "Credentials are not valid"
                })
            )
    })

    test('POST to /user/login must return 401 when wrong password, and return valid JSON', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send(
                {
                    "username": "feli",
                    "password": "holaa"
                })

        expect(res.statusCode).toBe(401);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error:true,
                    msg: "Credentials are not valid"
                })
            )
    })

    test('POST to /users/login must return status 500 when a server error ocurres', 
    async () => {
        const stub = sinon.stub(db.User, 'findOne').throws();
        let res = await request(app)
            .post('/api/v1/users/login')
            .send({
                "username": "feli",
                "password": "hola"
            })
        expect(res.statusCode)
            .toBe(500);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                }
            ))
        stub.restore();
    })

    ////////////UPDATE USER

    test('PUT to /users/:id must return 200, when requested by god, update and return user updated (with profilepic)', async () => {
        const userIdRequest = 1;
        const token = await generateToken('god');
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nico",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin",
                "profilepic": "https://imagewebsite.io/image.png",
            })

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User updated successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Nico",
                                    "last_name": "Caceres",
                                    "username": "nico",
                                    "email": "nico@gmail.com",
                                    "role": "admin",
                                    "profilepic": "https://imagewebsite.io/image.png"
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userUpdated = await db.User.findByPk(userIdRequest)

        expect(userUpdated)
            .toEqual(expect
                .objectContaining(
                {
                    user_id: userIdRequest,
                    first_name: "Nico",
                    last_name: "Caceres",
                    username: "nico",
                    email: "nico@gmail.com",
                    role: "admin",
                    password: expect.any(String),
                    profilepic: "https://imagewebsite.io/image.png"
                })
            )   
    })

    test('PUT to /users/:id must return 200, when requested by god, update and return user updated', async () => {
        const userIdRequest = 1;
        const token = await generateToken('god');
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nico",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User updated successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Nico",
                                    "last_name": "Caceres",
                                    "username": "nico",
                                    "email": "nico@gmail.com",
                                    "role": "admin",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userUpdated = await db.User.findByPk(userIdRequest)

        expect(userUpdated)
            .toEqual(expect
                .objectContaining(
                {
                    user_id: userIdRequest,
                    first_name: "Nico",
                    last_name: "Caceres",
                    username: "nico",
                    email: "nico@gmail.com",
                    role: "admin",
                    password: expect.any(String),
                })
            )   
    })

    test('PUT to /users/:id must return 200, when requested own user(admin) and change role to admin', async () => {
        const userIdRequest = 2;
        const token = await generateTokenWithId('admin', 2);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Juan",
                "lastname": "Cabrera",
                "username": "juanc",
                "password": "hola",
                "email": "juancabrera@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User updated successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Juan",
                                    "last_name": "Cabrera",
                                    "username": "juanc",
                                    "email": "juancabrera@gmail.com",
                                    "role": "admin",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userUpdated = await db.User.findByPk(userIdRequest)

        expect(userUpdated)
            .toEqual(expect
                .objectContaining(
                {
                    "user_id": userIdRequest,
                    "first_name": "Juan",
                    "last_name": "Cabrera",
                    "username": "juanc",
                    "email": "juancabrera@gmail.com",
                    "role": "admin",
                    password: expect.any(String),
                })
            )   
    })

    test('PUT to /users/:id must return 200, when requested own user(admin) and change role to guest', async () => {
        const userIdRequest = 2;
        const token = await generateTokenWithId('admin', 2);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Juan",
                "lastname": "Cabrera",
                "username": "juanc",
                "password": "hola",
                "email": "juancabrera@gmail.com",
                "role": "guest"
            })

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User updated successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Juan",
                                    "last_name": "Cabrera",
                                    "username": "juanc",
                                    "email": "juancabrera@gmail.com",
                                    "role": "guest",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userUpdated = await db.User.findByPk(userIdRequest)

        expect(userUpdated)
            .toEqual(expect
                .objectContaining(
                {
                    user_id: userIdRequest,
                    first_name: "Juan",
                    last_name: "Cabrera",
                    username: "juanc",
                    email: "juancabrera@gmail.com",
                    role: "guest",
                    password: expect.any(String),
                })
            )   
    })

    test('PUT to /users/:id must return 200, when requested own user(guest) and change role to guest', async () => {
        const userIdRequest = 1;
        const token = await generateTokenWithId('guest', 1);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "guest"
            })

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User updated successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Nicolas",
                                    "last_name": "Caceres",
                                    "username": "nico",
                                    "email": "nico@gmail.com",
                                    "role": "guest",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userUpdated = await db.User.findByPk(userIdRequest)

        expect(userUpdated)
            .toEqual(expect
                .objectContaining(
                {
                    user_id: userIdRequest,
                    first_name: "Nicolas",
                    last_name: "Caceres",
                    username: "nico",
                    email: "nico@gmail.com",
                    role: "guest",
                    password: expect.any(String),
                })
            )   
    })

    test('PUT to /users/:id must return 400, when username already taken', async () => {
        const userIdRequest = 1;
        const token = await generateToken('god');
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "juanc",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Username is already registred"
                }
            ))   
    })

    test('PUT to /users/:id must return 400, when email already taken', async () => {
        const userIdRequest = 1;
        const token = await generateToken('god');
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "juancabrera@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(400);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "E-mail is already registred"
                }
            ))   
    })

    test('PUT to /users/:id must return 403, when role is not god and user is not updating own data', async () => {
        const userIdRequest = 1;
        const token = await generateTokenWithId('admin', 2);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Not authorized"
                }
            ))
    })

    test('PUT to /users/:id must return 403, when requested own user(admin) and change role to god', async () => {
        const userIdRequest = 2;
        const token = await generateTokenWithId('admin', 2);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Juan",
                "lastname": "Cabrera",
                "username": "juanc",
                "password": "hola",
                "email": "juancabrera@gmail.com",
                "role": "god"
            })

        expect(res.statusCode).toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Not authorized"
                }
            ))
    })

    test('PUT to /users/:id must return 403, when requested own user(guest) and change role to admin', async () => {
        const userIdRequest = 1;
        const token = await generateTokenWithId('guest', 1);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Not authorized"
                }
            ))
    })

    test('PUT to /users/:id must return 403, when requested own user(guest) and change role to god', async () => {
        const userIdRequest = 1;
        const token = await generateTokenWithId('guest', 1);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "god"
            })

        expect(res.statusCode).toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Not authorized"
                }
            ))
    })

    test('PUT to /users/:id must return 403, when role is not god and user is not updating own data', async () => {
        const userIdRequest = 1;
        const token = await generateTokenWithId('admin', 2);
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Not authorized"
                }
            ))
    })

    test('PUT to /users/:id must return 404, when user not found', async () => {
        const userIdRequest = 20;
        const token = await generateToken('god');
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })

        expect(res.statusCode).toBe(404);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true, 
                    msg: "User does not exists."
                }
            ))   
    })

    test('PUT to /users/:id must return status 500 when a server error ocurres', 
    async () => {
        const stub = sinon.stub(db.User, 'findOne').throws();
        const userIdRequest = 1;
        const token = await generateToken('god');
        const res = await request(app)
            .put('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
            .send({
                "firstname": "Nicolas",
                "lastname": "Caceres",
                "username": "nico",
                "password": "hola",
                "email": "nico@gmail.com",
                "role": "admin"
            })
        expect(res.statusCode)
            .toBe(500);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                }
            ))
        stub.restore();
    })

    ////////////DELETE USER

    test('DELETE to /users/:id must return 403 when not god and not requested by owner', async () => {
        const userIdRequest = 2;
        const token = await generateTokenWithId('admin', 1);
        const res = await request(app)
            .delete('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})

        expect(res.statusCode).toBe(403);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: "Not authorized"
                }
            ))
        
        const userDeleted = await db.User.findByPk(userIdRequest)

        expect(userDeleted)
            .toEqual(expect
                .objectContaining(
                {
                    user_id: userIdRequest,
                    first_name: "Juan",
                    last_name: "Cabrera",
                    username: "juanc",
                    email: "juancabrera@gmail.com",
                    role: "guest",
                    password: expect.any(String),
                }
        ));
    })

    test('DELETE to /users/:id must return 200 when requested by god, delete it and return user deleted', async () => {
        const userIdRequest = 1;
        const token = await generateToken('god');



        const res = await request(app)
            .delete('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User deleted successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Nicolas",
                                    "last_name": "Caceres",
                                    "username": "nico",
                                    "email": "nico@gmail.com",
                                    "role": "guest",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userDeleted = await db.User.findByPk(userIdRequest)
        expect(userDeleted).toEqual(null);

        const cartDeleted = await db.Cart.findOne(
            {
                where:{
                    user_id: userIdRequest
                }
            }
        )
        expect(cartDeleted).toEqual(null);

        const cartProductDeleted = await db.cart_product.findAll(
            {
                where:{
                    cart_id: userIdRequest
                }
            }
        )

        expect(cartProductDeleted).toEqual([]);
    })

    test('DELETE to /users/:id must return 200 when deleting own user(guest), delete it and return user deleted', async () => {
        const userIdRequest = 6;
        const token = await generateTokenWithId('guest', userIdRequest);
        const res = await request(app)
            .delete('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User deleted successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Agustina",
                                    "last_name": "Razquin",
                                    "username": "agus",
                                    "email": "agus@gmail.com",
                                    "role": "guest",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userDeleted = await db.User.findByPk(userIdRequest)

        expect(userDeleted).toEqual(null);
    })

    test('DELETE to /users/:id must return 200 when deleting own user(admin), delete it and return user deleted', async () => {
        const userIdRequest = 4;
        const token = await generateTokenWithId('admin', userIdRequest);
        const res = await request(app)
            .delete('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})

        expect(res.statusCode).toBe(200);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: false,
                    msg: 'User deleted successfully',
                    data: expect
                            .objectContaining(
                                {
                                    "user_id": userIdRequest,
                                    "first_name": "Marco",
                                    "last_name": "Bonzini",
                                    "username": "marco",
                                    "email": "marco@gmail.com",
                                    "role": "admin",
                                    "profilepic": null
                                }
                            )
                }
            ))
        expect(res.body.data).not.toContainKey('password');
        
        const userDeleted = await db.User.findByPk(userIdRequest)

        expect(userDeleted).toEqual(null);
    })

    test('DELETE to /users/:id must return 200 when deleting own user(admin), delete it and return user deleted', async () => {
        const userIdRequest = 4;
        const token = await generateTokenWithId('admin', userIdRequest);
        const res = await request(app)
            .delete('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})

        expect(res.statusCode).toBe(404);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                    msg: 'User does not exists.'
                }
            ))
        
        const userDeleted = await db.User.findByPk(userIdRequest)

        expect(userDeleted).toEqual(null);
    })

    test('DELETE to /users/:id must return status 500 when a server error ocurres', 
    async () => {
        const stub = sinon.stub(db.User, 'destroy').throws();
        const userIdRequest = 5;
        const token = await generateToken('god');
        const res = await request(app)
            .delete('/api/v1/users/' + userIdRequest)
            .auth(token,{type:'bearer'})
        expect(res.statusCode)
            .toBe(500);
        expect(res.body)
            .toEqual(expect
                .objectContaining(
                {
                    error: true,
                }
            ))
        stub.restore();
    })
})