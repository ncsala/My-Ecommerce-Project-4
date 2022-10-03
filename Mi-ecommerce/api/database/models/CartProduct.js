const CartProduct = (sequelize, DataTypes) => {
    
    const alias = "cart_product";
    const cols ={
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        product_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt:{
            type: DataTypes.DATE
        },
        updatedAt:{
            type: DataTypes.DATE
        }

    };
    const config = {
        timestamps: true,

    }
    const CartProduct = sequelize.define(alias,cols,config);
    return CartProduct;
}

module.exports = CartProduct