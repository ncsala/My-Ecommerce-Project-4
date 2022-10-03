const filesHandler = require('../../helpers/filesHelpers');
const db = require('../database/models');

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
                cart_id: id
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
                        'cart_id': id
                    },
                    attributes: ['product_id', 'quantity', 'createdAt', 'updatedAt']
                })
                res.status(200).json({
                    error: false,
                    msg: 'Success',
                    data: cart
                })
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



        

        // const inCart = await db.cart_product.findOne({
        //     where:{
        //         'product_id': newProduct.id,
        //         'cart_id': id},
        //     attributes: ['product_id']
        // })
        // if(!inCart){
        //     const cartInsert = await db.cart_product.create({
        //         cart_id: id,
        //         product_id: newProduct.id,
        //         quantity: newProduct.quantity
        //     })
        // }else{
        //     const cartUpdate = await db.cart_product.update({
        //         quantity: newProduct.quantity 
        //     },{
        //         where: {
        //             'product_id': newProduct.id
        //         }
        //     }
        //     )
        // }







// if(isNaN(id)){
//     return res.status(500).json({
//         msj: 'El parametro id debe ser un numero'
//     })
// }
// const role= req.newUsers.role;
//     if(req.newUsers.id === Number(id) || role === 'god' || role === 'admin'){
//         try {
//             const users = filesHandler.getUsers(next);
//             const user = users.find(el => el.id === Number(id));
//             if(!user){
//                 return res.status(404).json({
//                     error: true,
//                     msg: 'Id de usuario no encontrado.'
//                 })
//             }
//             const cart = user.cart;
//             if(cart.length == 0){
//                 return res.status(200).json({
//                     error: false,
//                     msg: 'El carrito del usuario ' + user.username + ' esta vacio.',
//                     data:[]
//                 })
//             }
//             return res.status(200).json({
//                 error: false,
//                 msg: 'Carrito del usuario ' + user.username,
//                 data: cart
//             })

//         } catch (error) {
//             next(error);
//         }
//     } else{
//         return res.status(500).json({
//             error: true,
//             msg: 'No tienes los permisos para efectuar esta accion'
//         })
//     }

// } 

// const cartEdit = (req,res,next) => {
//     const id = req.params.id;
//     if(isNaN(id)){
//         return res.status(500).json({
//             error: true,
//             msg: 'El parametro id debe ser un numero'
//         })
//     }
//     const cartUpdate = req.body;
//     const role= req.newUsers.role;
//     if(cartUpdate.length > 0){  
//         if(req.newUsers.id === Number(id) || role === 'god'){
//             try {
//                 const users = filesHandler.getUsers(next);
//                 const user = users.find(el => el.id === Number(id));            
//                 if(!user){
//                     return res.status(404).json({
//                         error: true,
//                         msg: 'Id de usuario no encontrado.'
//                     })
//                 }
//                 const cart = user.cart;
//                 cartUpdate.forEach(element => {
//                     if(!element.id || !element.quantity || isNaN(element.id) || isNaN(element.quantity)){
//                         filesHandler.guardarUsers(users,res);
//                         return res.status(400).json({
//                             error: true,
//                             msg: 'Error: Cada producto debe tener id, quantity y ambos deben ser numeros.',
//                             data: cart
//                         })
//                     }
//                     const aux = cart.find(el => el.id == element.id);
//                     if(!aux){
//                         cart.push(element);
//                     }else{
//                         aux.quantity += Number(element.quantity);
//                     }
//                     });
//                     filesHandler.guardarUsers(users,next);
//                     return res.status(200).json({
//                         error: false,
//                         msg: 'Carrito actualizado:',
//                         data: cart
//                     })
//             } catch (error) {
//                 next(error);
//             }
//         }else{
//             return res.status(403).json({
//                 error: true,
//                 msg: 'No tienes los permisos para efectuar esta accion'
//             })
//             } 
//     }else{
//         return res.status(400).json({
//             error: true,
//             msg: 'Debe ingresar al menos un producto'
//         })
//     }

