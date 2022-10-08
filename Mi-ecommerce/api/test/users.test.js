const { app } = require("../../server.js")
const request = require('supertest');
const db = require('../database/models');
const sinon = require('sinon');

const {
	generateToken,
    cargarDatos,
    generateTokenWithId
} = require('./helpers');

const { Op } = require("sequelize");

beforeAll(async () => {
    await cargarDatos()
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

    
})