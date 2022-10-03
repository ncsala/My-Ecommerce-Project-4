const joi = require('joi');

const id = joi.number().integer().min(1).messages({
	'number.base': 'Id must be a number',
	'number.integer': 'Id must be a integer',
	'number.min': 'Id must be a number greater than 0',
});

const url = joi
	.string()
	.uri()
	.messages({ 'string.uri': 'URL must be a valid URL' });
  
const description = joi
	.string()
	.min(10)
	.max(150)
	.messages({
    'string.base': 'Description must be a string',
		'string.min': 'Description must be at least 10 character long',
		'string.max': 'Description must be at most 150 characters long',
	});

const getProductPicturesSchema = joi.object({
	product: id.required().messages({ 'any.required': 'Product is required' }),
});

const createSchema = joi.object({
  pictureUrl: url.required().messages({ 'any.required': 'URL is required' }),
  pictureDescription: description,
  productId: id.required().messages({ 'any.required': 'Product Id is required' }),
});

const updateSchema = joi.object({
  pictureUrl: url.required().messages({ 'any.required': 'URL is required' }),
  pictureDescription: description,
});


module.exports = { getProductPicturesSchema, createSchema, updateSchema};
