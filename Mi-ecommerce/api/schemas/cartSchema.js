const joi = require('joi');

const id = joi.number().integer().min(1).messages({
	'number.base': 'Id must be a number',
	'number.integer': 'Id must be a integer',
	'number.min': 'Id must be a number greater than 0',
});

const quantity = joi.number().integer().messages({
	'number.base': 'Quantity must be a number',
	'number.integer': 'Quantity must be a integer',
});

const idByParamsSchema = joi.object({
	id: id.required().messages({ 'any.required': 'Id is required' }),
});

const editSchema = joi.object({
    id: id.required().messages({ 'any.required': 'Product id is required'}),
    quantity: quantity.required().messages({ 'any.required': 'Product quantity is required'})
})

module.exports = { idByParamsSchema, editSchema };