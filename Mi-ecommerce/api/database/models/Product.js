const Product = (sequelize, DataType)=>{

    let alias = 'Product'
    
    let cols={

        product_id:{
            type:DataType.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },

        title:{
            type: DataType.STRING,
            allowNull:false
        },

        //precio con dos decimales
        price:{
            type: DataType.DECIMAL(10,2),
            allowNull:false
        },

        description:{
            type: DataType.TEXT,
            allowNull:true
        },

        category_id:{
            type: DataType.INTEGER,
            // foreignKey:true
        },

        mostwanted:{
            type: DataType.TINYINT(1),
            defaultValue: 0,
        },

        stock:{
            type: DataType.INTEGER,
            allowNull:true,
            defaultValue:0
        }

    }

    let conf = {
        timestamps: false
    }

    const Product = sequelize.define(alias,cols,conf);
        Product.associate = (models)=>{

            Product.hasMany(models.Picture,{
                as:"gallery",
                foreignKey:"product_id",
                onDelete:"CASCADE"
            })

            Product.belongsToMany(models.Cart,{
                as:"productcart",
                through:"cart_product",
                foreignKey:"product_id",
                otherKey:"cart_id"
            })

            Product.belongsTo(models.Category,{
                as:"category",
                foreignKey:"category_id"
            })
        }
    return Product;
}

module.exports = Product;