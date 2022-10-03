const joi = require('joi');

const name = joi.string().min(1).max(150).messages({
    'string.base': 'name must be a string',
    'string.min': 'name must be at least 1 character long',
    'string.max': 'name must be at most 150 characters long',
  });
  const createCategorySchema = joi.object({
    name: name.required().messages({ 'any.required': 'name is required' }),
  });

  module.exports = {createCategorySchema};