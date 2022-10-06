const { raw } = require('express');
const { Op } = require('sequelize');
const fileHelpers = require('../../helpers/filesHelpers');
const { Sequelize, sequelize } = require('../database/models');
const db = require('../database/models');
const Picture = require('../database/models/Picture');


const productsController = {

    listar: async (req, res, next)=>{

        if(req.newUsers.role != 'guest' && req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
            return res.status(401).json({
                error: true,
                msg:'you have to log in in order to see the products'
            })
        }

        try {
            const {category} = req.query
    
            if(category){
    
                let products = await db.Product.findAll({
                    attributes:{   
                        exclude:['category_id'],
                        include:[
                            [sequelize.col('Category.category_name'),'category_name']
                        ]
                    },
                    include:[
                        {
                            model: db.Category,
                            as:'category',
                            attributes:[],
                            where:{
                                category_id:category
                            },
                        },
                        {
                            association:'gallery',
                            as:"gallery"
                        }
                    ]
                })
    
                if(products.length == 0){
                    return res.status(404).json({
                        error:true,
                        msg: "Doesn't exist products with this category"
                    })
                }
                
    
                return res.status(200).json({
                    error: false,
                    msg: "Products by category",
                    data: products
                })
                
            }else{
    
                let products = await db.Product.findAll({
                    // raw:true,
                    attributes:{   
                            exclude:['category_id'],
                            include:[
                                [sequelize.col('Category.category_name'),'category_name']   
                            ]
                    },
                    include:[
                        {
                            association:"gallery",
                            as:"gallery"
                        },
                        {
                            model: db.Category,
                            as:'category',
                            attributes:[]
                        } 
                    ]
                });
        
                return res.status(200).json({
                            error:false,
                            msg: "All products",
                            data: products
                        })
    
            }
            
        } catch (error) {
            next(error);
        }
    },

    detalle: async (req, res, next)=>{

        if(req.newUsers.role != 'guest' && req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
            return res.status(401).json({
                error: true,
                msg:'you have to log in in order to see the products'
            })
        }

       try {
           const {id} = req.params;
           let prod = await db.Product.findByPk(id,{
                attributes:{   
                    exclude:['category_id'],
                    include:[
                        [sequelize.col('Category.category_name'),'category_name']
                    ]
                },
               include:[
                   {
                       association:"gallery",
                       as:"gallery"
                   },
                   {
                    model: db.Category,
                    as:"category",
                    attributes:[]
                } 
               ]
           });
           if(!prod){
               return res.status(404).json({
                   error: true,
                   msg: "Product not found"
               })
           }
           return res.status(200).json({
                           error: false,
                           msg: "Product detail",
                           data: prod
                       });
        
       } catch (error) {
            next(error);
       }
        
    },
    
    mostwanted: async (req, res, next)=>{

        if(req.newUsers.role != 'guest' && req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
            return res.status(401).json({
                error: true,
                msg:'you have to log in in order to see the products'
            })
        }

        try {
            let products = await db.Product.findAll({
                attributes:{   
                    exclude:['category_id'],
                    include:[
                        [sequelize.col('Category.category_name'),'category_name']
                    ]
                },
                where:{
                    mostwanted:true
                },
                include:[
                    {
                        association:"gallery",
                        as:"gallery"
                    },
                    {
                        model: db.Category,
                        as:"category",
                        attributes:[]
                    }
                ]
            })
        
            return res.status(200).json({
                        error: false,
                        msg: "Most wanted products",
                        data: products
                    })
            
        } catch (error) {
            next(error);
        }

    },

    crear: async (req, res, next)=>{

        try {
            const{title, price, description, gallery, stock, mostwanted, category} = req.body;
    
            const rol = req.newUsers.role;
            
            if(req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
                return res.status(401).json({
                    error: true,
                    msg:"You don't have permission to create a product"
                })
            }

            if(category != undefined){
                let cat = await db.Category.findByPk(category);
    
                if(!cat){
                    return res.status(404).json({
                        error: true,
                        msg:`category with id = ${category} not found`
                    })
                }

            }
    
            const newProduct = {
                title: title,
                description: description == undefined? "" : description,
                price: price == undefined? 0 : price,
                stock: stock == undefined? 0 : stock,
                mostwanted:mostwanted == undefined? 0 : mostwanted,
                category_id:category == undefined? null : category
            }
    
            let prod = await db.Product.create(newProduct);
    
             return res.status(201).json({
                 error:false,
                 msg:"Product created",
                 data: prod
             })
            
        } catch (error) {
            next(error);
        }
    },
    
    eliminar: async (req, res, next)=>{

        try {
            const {id} = req.params;
            const rol = req.newUsers.role;
            
            if(req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
                return res.status(401).json({
                    error: true,
                    msg:"You don't have permission to delete a product"
                })
            }

            let prodInCarts = await db.cart_product.findAll({
                where:{
                    product_id:id
                }
            })
    
            if(prodInCarts.length != 0){
                return res.status(400).json({
                    error:true,
                    msg:`Product with id = ${id} is included in some carts, delete it from the carts in order to delete the product`
                })
            }

            let prod = await db.Product.findByPk(id,{
                attributes:{
                     exclude:['category_id'],
                    include:[
                        [sequelize.col('Category.category_name'),'category_name']
                    ]
                }
               ,
                include:[
                    {association:'gallery'},
                    {
                        model:db.Category,
                        as:'category',
                        attributes:[]
                    }
                ]});

            if(prod == undefined){
                return res.status(404).json({
                    error: true,
                    msg:"Product not found"
                })
            }


            let n = await db.Product.destroy({
                        where:{
                            product_id:id
                        }
                    });
            
            // if(n == 0){
            //     return res.status(404).json({
            //                 error: true,
            //                 msg:"Product not found"
            //             })
            // }
    
    
            return res.status(200).json({
                        error: false,
                        msg:"Product deleted",
                        data:prod
                    })
            
        } catch (error) {
            next(error);
        }
    },

    busqueda: async (req, res, next)=>{

        if(req.newUsers.role != 'guest' && req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
            return res.status(401).json({
                error: true,
                msg:'you have to log in in order to see the products'
            })
        }

        try {
            const {q} = req.query; 
    
            let productsFiltrados = await db.Product.findAll({
                attributes:{
                    exclude:['category_id'],
                    include:[
                        [sequelize.col('Category.category_name'),'category_name']
                    ]
                },
                where:{
                    [Op.or]:[
                        {title:{
                            [Op.like]:`%${q}%`
                        }},
                        {description:{
                            [Op.like]:`%${q}%`
                        }}
                    ]
                },
    
                include:[
                    {
                        association:"gallery",
                        as:"gallery"
                    },
                    {
                        model: db.Category,
                        as:"category",
                        attributes:[]
                    }
                ]


            })
    
            return res.status(200).json({
                error: false,
                msg:"Products filtered",
                data: productsFiltrados
            })
            
        } catch (error) {
            next(error);
        }
    },

    modificar: async (req, res, next)=>{

        try {
            
            const {id} = req.params;
            const rol = req.newUsers.role;
            if(req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
                return res.status(401).json({
                    error: true,
                    msg:"You don't have permission to modify a product"
                })
            }

            const {title, description, price, category, mostwanted, stock} = req.body;
            let prod = await db.Product.findByPk(id);
            
            if(prod == undefined){
                return res.status(404).json({
                    error: true,
                    msg:`Product with id = ${id} does not exist`
                })
            }
            
            if(category != undefined){
                let cat = await fileHelpers.existeCat(category);
                if(!cat){
                    return res.status(400).json({
                        error:true,
                        msg:`category with id = ${category} does not exist`
                    })
                }
            }
            let prodModificado = {
                title: title == undefined? prod.title : title,
                description: description == undefined? prod.description : description,
                price : price == undefined? prod.price : price,
                category_id : category == undefined? prod.category_id : category,
                mostwanted: mostwanted == undefined? prod.mostwanted : mostwanted,
                stock: stock == undefined? prod.stock : stock
            }
            await db.Product.update(prodModificado,{
                where:{
                    product_id : id
                }
            })

            let selectProdMod = await db.Product.findByPk(id,{
                attributes:{   
                    exclude:['category_id'],
                    include:[
                        [sequelize.col('Category.category_name'),'category_name']
                    ]
                },
               include:[
                   {
                       association:"gallery",
                       as:"gallery"
                   },
                   {
                    model: db.Category,
                    as:"category",
                    attributes:[]
                } 
               ]
            });

            return res.status(200).json({
                error: false,
                msg:"Product modified",
                data:selectProdMod
            })

        } catch (error) {
            next(error);
        }
        
    },

    pictures: async (req, res, next) => {

        if(req.newUsers.role != 'guest' && req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
            return res.status(401).json({
                error: true,
                msg:'you have to log in in order to see the products'
            })
        }

        const { id } = req.params;

        try {
    
            const productExists = await db.Product.findByPk(id);
    
            if (!productExists) {
                return res.status(404).json({
                    error: true,
                    msg: 'Product not found',
                });
            }
    
            const picturesProduct = await db.Picture.findAll({
                where: {
                    product_id: id,
                },
            });
    
            if (!picturesProduct.length) {
                return res.status(404).json({
                    error: true,
                    msg: 'The product does not have images',
                });
            }
    
            res.status(200).json({
                error: false,
                msg: 'Product photo list',
                data: picturesProduct,
            });
        } catch (error) {
            next(error);
        }
    },

    categoria: async (req, res, next)=>{

        if(req.newUsers.role != 'guest' && req.newUsers.role != 'admin' && req.newUsers.role != 'god'){
            return res.status(401).json({
                error: true,
                msg:'you have to log in in order to see the products'
            })
        }

        try {
            const {category} = req.query;
    
           let products = db.Product.findAll({
                attributes:{
                    exclude:['category_id'],
                    include:[
                        [sequelize.col('Category.category_name'),'category_name']
                    ]
                },
                where:{
                    category_id:category
                },
                include:[
                    {
                        association:"gallery",
                    },
                    {
                        model:db.Category,
                        as:"category",
                        attributes:[]
                    }
                ]
           })
    
            if(products.length == 0){
                return res.status(404).json({
                    error:true,
                    msg: "No products found"
                })
            }
    
            return res.status(200).json({
                error:false,
                msg: "Products filtered by category",
                data: products
            })
            
        } catch (error) {
            next(error)
        }


        
    }
}

module.exports = productsController;