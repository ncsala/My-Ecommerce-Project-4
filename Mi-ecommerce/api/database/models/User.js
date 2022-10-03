module.exports = (sequelize, DataTypes) => {
    const alias = 'User';
    const cols = {
        user_id: {
            type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
        },
        first_name: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        username: { 
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: { 
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: { 
            type: DataTypes.ENUM('admin' , 'god', 'guest'),
            defaultValue: 'guest',
            allowNull: true
        },
        profilepic: { 
            type: DataTypes.STRING,
            allowNull: true
        }
    }

    const config = {
        timestamps: false
    }

    const User = sequelize.define(alias, cols, config);
    User.associate = (models)=>{

        User.hasOne(models.Cart, {
            as: 'usercart',
            foreignKey: 'user_id',
            onDelete: "CASCADE"
        })

    }
    
    return User;
}