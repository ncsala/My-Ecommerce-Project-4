module.exports = (sequelize, DataTypes) => {
	const alias = 'Picture';

	const cols = {
		picture_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},

		picture_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		picture_description: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		product_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			foreignKey: true,
		},
	};

	const config = {
		timestamps: false,
		// createdAt: false,
		// updatedAt: false,
	};

	const Picture = sequelize.define(alias, cols, config);

	Picture.associate = function (models) {
		Picture.belongsTo(models.Product, {
			as: 'productpicture',
			foreignKey: 'product_id',
			onDelete: 'CASCADE',
		});
	};

	return Picture;
};
