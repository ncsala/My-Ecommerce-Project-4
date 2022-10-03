const joi = require('joi');

const title = joi.string().min(10).max(150).messages({
	'string.base': 'Title must be a string',
	'string.min': 'Title must be at least 10 character long',
	'string.max': 'Title must be at most 150 characters long',
});

const price = joi.number().min(1).messages({
	'number.base': 'Price must be a number',
	'number.min': 'Price must be a number greater than 0',
});

const description = joi.string().min(10).max(150).messages({
	'string.base': 'Description must be a string',
	'string.min': 'Description must be at least 10 character long',
	'string.max': 'Description must be at most 150 characters long',
});

const category = joi.number().min(1).messages({
  'number.base': 'Category must be a number',
  'number.min': 'Category must be a number greater than 0',
});


const mostwanted = joi.boolean().messages({
	'boolean.base': 'Most wanted must be a boolean',
});

const stock = joi.number().integer().min(0).messages({
	'number.base': 'Stock must be a number',
	'number.integer': 'Stock must be a integer',
	'number.min': 'Stock must be a number greater than 0',
});

//personalizar mensaje de is not allowed to be empty
const q = joi.string().min(1).max(50).empty('').messages({
  'string.base': 'Search must be a string',
  'string.min': 'Search must be at least 1 character long',
  'string.max': 'Search must be at most 50 characters long',
  'string.empty': 'Search is not allowed to be empty', 
});

const createProductSchema = joi.object({
	title: title.required().messages({ 'any.required': 'Title is required' }),
	price: price.required().messages({ 'any.required': 'Price is required' }),
	description: description,
	category: category,
	mostwanted: mostwanted,
	stock: stock
});

const updateProductSchema = joi
	.object({
		title: title,
		price: price,
		description: description,
		category: category,
		mostwanted: mostwanted,
		stock: stock,
	})
	.min(1)
	.messages({
		'object.min': 'You must modify at least one property of the product',
	});

const searchProductSchema = joi.object({
	q: q.required().messages({ 'any.required': 'Search is required' }),
});

const categoryPoductSchema = joi.object({
	category: category,
});

module.exports = {
	createProductSchema,
	searchProductSchema,
	updateProductSchema,
	categoryPoductSchema,
};
