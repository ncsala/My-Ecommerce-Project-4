const Cart = (sequelize, DataTypes) => {
    
    const alias = "Cart";
    const cols ={
        
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            foreignKey: true
        }
    };
        const config = {
            timestamps: false,

        }

    const Cart = sequelize.define(alias,cols,config);
    Cart.associate = (models) => {

        Cart.belongsTo(models.User,{
            as:"cartuser",
            foreignKey:"user_id",
            onDelete: "CASCADE"
        })

        Cart.belongsToMany(models.Product, {
            as: "cartproduct",
            through: 'cart_product',
            foreignKey: 'cart_id',
            otherKey: 'product_id',
	        onDelete: "CASCADE"
        })
    }
    return Cart;
}

module.exports = Cart;