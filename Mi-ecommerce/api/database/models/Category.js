const Category = (sequelize, DataTypes) => {
    const alias = "Category";

    const cols = {
        category_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },

        category_name:{
            type:DataTypes.STRING,
            allowNull: false,
            unique:true
        }
    } 

    const config = {
        timestamps: false
    }

    const Catergory = sequelize.define(alias,cols,config);
        Catergory.associate = (models) => {
            Catergory.hasMany(models.Product,{
                foreignKey: "category_id",
                onDelete:"SET NULL"
            })
        }
    return Catergory;
}

module.exports = Category;