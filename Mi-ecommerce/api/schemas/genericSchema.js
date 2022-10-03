const joi = require('joi');

const id = joi.number().integer().min(1).messages({
	'number.base': 'Id must be a number',
	'number.integer': 'Id must be a integer',
	'number.min': 'Id must be a number greater than 0',
});

const idByParamsSchema = joi.object({
	id: id.required().messages({ 'any.required': 'Id is required' }),
});

module.exports = { idByParamsSchema };