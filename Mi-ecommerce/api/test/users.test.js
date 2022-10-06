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

    test('/users debe devolver status 200 y con el formato json correcto', async ()=>{
        const token = await generateToken('admin');
        let res = await request(app).get('/api/v1/users').auth(token,{type:'bearer'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining(
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
})