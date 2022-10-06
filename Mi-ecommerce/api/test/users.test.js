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

describe('/users GET',()=>{

    ////////////GET USERS

    test('/users debe devolver status 200 como admin y con el formato json correcto (lista de usuarios)', 
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

    test('/users debe devolver status 200 como god y con el formato json correcto (lista de usuarios)', 
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

    test('/users debe devolver status 403 como guest y con el formato json correcto', 
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

    test('/users debe devolver status 500 con error del servidor', 
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
        }
    )

    ////////////GET USER

    test('/user debe devolver status 200 y con formato de json correcto (usuario solicitado)',
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


})