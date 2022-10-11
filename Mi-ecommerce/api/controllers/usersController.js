const bcrypt = require('bcrypt');
const {generateJWT} = require('../../helpers/generateJWT');
const db = require('../database/models');
const { Op, where } = require('sequelize');
const { raw } = require('express');
//const { Where } = require('sequelize/types/utils');

const usersController = {
    listUsers: async function(req, res, next) {

        try {
            let users = await db.User.findAll(
                {
                    attributes: {exclude: ['password']},
                    raw: true
                }
            );
            return res.status(200).json({
                error: false,
                msg: 'Users list',  
                data: users
            });
        } catch (error) {
            next(error);
        }
    }, 

    getUser: async function(req, res, next) {

        const userId = Number(req.params.id);
        try {
            const user = await db.User.findByPk(
                userId, 
                {
                    attributes: {exclude: ['password']}
                }
            );

            if(!user){
                return res.status(404).json({
                    error: true,
                    msg: "User does not exists."
                });
            }

            return res.status(200).json({
                error: false,
                msg:"Detalle de usuario",
                data:user
            });
        }catch(error){
            next(error);
        }
    },

    createUser: async function(req, res, next) {
        const userFromRequest = req.body;
        try {
            const userFound = await db.User.findOne(
                {
                    where: 
                    {
                        [Op.or]: [{username: userFromRequest.username}, 
                                  {email: userFromRequest.email}]
                    }
                }
            )
            if(userFound && userFound.username === userFromRequest.username){
                return res.status(400).json({
                    error: true,
                    msg: "Username is already registred",
                });
            }
            if(userFound && userFound.email === userFromRequest.email){
                return res.status(400).json({
                    error: true,
                    msg: "E-mail is already registred",
                });
            }
            
            const hash = await bcrypt.hash(userFromRequest.password, 10);

            //Create new user
            const newUser = await db.User.create({
                first_name: userFromRequest.firstname, 
                last_name: userFromRequest.lastname, 
                username: userFromRequest.username, 
                password: hash, 
                email: userFromRequest.email, 
                role: userFromRequest.role,
                profilepic: userFromRequest.profilepic? userFromRequest.profilepic : null
            })

            //Create new cart
            await db.Cart.create({
                user_id: newUser.user_id
            })

            const userToReturn = await db.User.findByPk(
                newUser.user_id, 
                {
                    attributes: {exclude: ['password']}
                }
            );

            res.status(201).json({
                error: false,
                msg: "User created successfully",
                data: userToReturn
            })
        } catch (error) {
            next(error);
        }
    },

    login: async function(req, res, next) {
        const {username,password} = req.body;

        try {
            let userFound = await db.User.findOne({
                where: {username: username},
            })

            let hashMatches = false;
            if(userFound) {hashMatches = await bcrypt.compare(password, userFound.password);}

            if(!userFound || !hashMatches)
            {
                return res.status(401).json({
                    error:true,
                    msg: "Credentials are not valid"
                })
            }

            const userFoundWithoutPassword = await db.User.findOne({
                where: {username: username},
                attributes: {exclude: ['password']}
            })

            const token = await generateJWT(userFoundWithoutPassword.dataValues);
  
            return res.status(200).json({
                error:false,
                msg:"authorized",
                data:{
                    idUser: userFoundWithoutPassword.user_id,
                    username: userFoundWithoutPassword.username
                },
                token: token
            })
        } catch (error) {
            next(error)
        }
    },

    updateUser: async function(req, res, next) {
        let userFromRequest = req.body;
        const userId = Number(req.params.id);

        try {

            const userExists = await db.User.findByPk(userId)

            if(!userExists){ return res.status(404).json({error: true, msg: "User does not exists."}) }

            const userFound = await db.User.findOne(
                {
                    where: 
                    {
                        [Op.and]: [
                            {
                                user_id: {[Op.ne]: userId}
                            },
                            {
                                [Op.or]: [{username: userFromRequest.username}, 
                                        {email: userFromRequest.email}]
                            }
                        ]
                    }
                }
            )

            if(userFound && userFound.username === userFromRequest.username){
                return res.status(400).json({
                    error: true,
                    msg: "Username is already registred",
                });
            }
            if(userFound && userFound.email === userFromRequest.email){
                return res.status(400).json({
                    error: true,
                    msg: "E-mail is already registred",
                });
            }

            userFromRequest.password = await bcrypt.hash(userFromRequest.password, 10);

            await db.User.update(
                {
                    first_name: userFromRequest.firstname, 
                    last_name: userFromRequest.lastname, 
                    username: userFromRequest.username, 
                    password: userFromRequest.password, 
                    email: userFromRequest.email, 
                    role: userFromRequest.role,
                    profilepic: userFromRequest.profilepic? userFromRequest.profilepic : null
                },
                {where: {user_id: userId}}
            );

            const user = await db.User.findByPk(
                userId, 
                {
                    attributes: {exclude: ['password']}
                }
            );
            
            res.status(200).json({error: false, msg: "User updated successfully", data: user});

        } catch (error) {
            next(error)
        }
    },

    deleteUser: async function(req, res,next) {
        const userId = Number(req.params.id);

        try {
            const user = await db.User.findByPk(
                userId, 
                {
                    attributes: {exclude: ['password']}
                }
            );

            if(!user) {return res.status(404).json({error: true, msg: "User does not exists."});}

            const cartuser = await db.Cart.findOne(
                {
                    where: {
                        cart_id: userId
                    },
                    attributes: ['cart_id']
                }
            );

            const products = await db.cart_product.findAll(
                {
                    where: {
                        cart_id: cartuser.cart_id
                    }
                }
            )

            for await (let product of products)
            {
                await db.Product.increment('stock',
                    {
                        by: product.quantity,
                        where: {
                            product_id: product.product_id
                        }
                    }
                )
            }
            
            await db.User.destroy({
                where: {user_id: userId}
            });

            return res.status(200).json({error: false, msg:"User deleted successfully", data: user});
            

        } catch (error) {
            next(error);
        }
    }
}

module.exports = usersController;