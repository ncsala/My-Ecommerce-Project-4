const filesHandler = require('../../helpers/filesHelpers');
const db = require('../database/models');
const {Op} = require('sequelize')

//Listar carrito
const cartList = async (req,res, next) => {
const role= req.newUsers.role;
const id = req.params.id

//Checkeo de rol
if(req.newUsers.user_id == id || role === 'god' || role === 'admin'){
    try {
        const cartExists = await db.Cart.findByPk(id)
        if(!cartExists){
            return res.status(404).json({
                error: true,
                msg: 'Cart not found',
            });
        }
        const cartUsuario = await db.cart_product.findAll({
            where: {
                cart_id: id,
                quantity: {[Op.gt] : 0}
            },
            attributes: ['product_id', 'quantity', 'createdAt', 'updatedAt']

        })
        return res.status(200).json({
            error: false,
            msg: 'User cart:',
            data: cartUsuario
        });

        } catch (error) {
        next(error);
        }
    }else{
        return res.status(403).json({
            error: true,
            msg: 'Forbidden'
        })
    }
}


//Editar carrito
const cartEdit = async (req,res,next) => {
    const role= req.newUsers.role;
    const id = req.params.id;
    if(req.newUsers.user_id == id || role === 'god'){
        try {
            const newProduct = req.body;
            const cartExists = await db.Cart.findByPk(id)
            if(!cartExists){
                return res.status(404).json({
                    error: true,
                    msg: 'Cart not found',
                });
            }
            //Hallar el carrito
            const productExists = await db.Product.findByPk(newProduct.id)

            if(!productExists){
                return res.status(404).json({
                    error: true,
                    msg: 'Product not found',
                });
            }
            //Verificar stock
            if(productExists.dataValues.stock - newProduct.quantity < 0){
                return res.status(404).json({
                    error: true,
                    msg: 'Not enough stock'
                })
            }
                //Insertar al carrito
                
                //Sobreescribiendo cantidad
                //     const cartUpdate = await db.cart_product.upsert({
                //         product_id: newProduct.id
                //         cart_id: id,
                //         quantity: newProduct.quantity
                // })

                //Check cart
                const inCart = await db.cart_product.findOne({
                    where:{
                        'product_id': newProduct.id,
                        'cart_id': id},
                    attributes: ['product_id', 'quantity']
                })
                if(!inCart){
                    const cartInsert = await db.cart_product.create({
                        cart_id: id,
                        product_id: newProduct.id,
                        quantity: newProduct.quantity
                    })
                //Actualizar cantidad en cart
                }else{
                    let newQuantity = inCart.dataValues.quantity + newProduct.quantity
                    if(newQuantity < 0){
                        return res.status(400).json({
                            error: true,
                            msg: 'Invalid Quantity'
                        })
                    }
                    const cartUpdate = await db.cart_product.update({
                        quantity: newQuantity 
                    },{
                        where: {
                            'product_id': newProduct.id,
                            'cart_id': id
                        }
                    }
                    )
                }

            //Actualizar stock
                const newStock = productExists.dataValues.stock - newProduct.quantity
                const updateStock = await db.Product.update({stock: newStock},{
                    where: {
                        product_id : newProduct.id
                    }

                })
            //Imprimir
                const cart = await db.cart_product.findAll({
                    where:{
                        'cart_id': id,
                        quantity: {[Op.gt] : 0}
                    },
                    attributes: ['product_id', 'quantity', 'createdAt', 'updatedAt']
                })
                res.status(200).json({
                    error: false,
                    msg: 'Success',
                    data: cart
                })

                //limpiar bd
                // const clean = await db.cart_product.destroy({where:{
                //     quantity: 0
                // }})
            } catch (error) {
                next(error);
            }
    }
    else{
        return res.status(403).json({
            error: true,
            msg: 'Forbidden'
        })
    } 

}



module.exports = {
    cartList, 
    cartEdit
};


