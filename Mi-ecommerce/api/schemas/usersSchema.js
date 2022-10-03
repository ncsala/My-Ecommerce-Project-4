const joi = require('joi');

const id = joi.number().integer().min(1).messages({
	'number.base': 'Id must be a number',
	'number.integer': 'Id must be a integer',
	'number.min': 'Id must be a number greater than 0',
});

const email = joi.string().email().messages({
	'string.email': 'Email must be a valid email',
});

const username = joi.string().min(3).max(20).messages({
	'string.base': 'Username must be a string',
	'string.min': 'Username must be at least 3 characters long',
	'string.max': 'Username must be at most 20 characters long',
});

// Contraseña debe de tener al menos un numero, una letra en minuscula, una mayuscula y un caracter especial.
// No pueden aparecer espacios en blanco. de 8 a 20 caracteres.
// const password = joi
// 	.string()
// 	.pattern(
// 		/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*@#$%^&+=])(?=\S+$).{8,20}$/
// 	)
// 	.messages({
// 		'string.base': 'Password must be a string',
// 		'string.pattern.base':
// 			'Password must have at least one number, one lowercase letter, one uppercase letter, one special character and no spaces. It must be between 8 and 20 characters long',
// 	});
const password = joi.string().min(4).max(20).messages({
	'string.base': 'Password must be a string',
	'string.min': 'Password must be at least 4 characters long',
	'string.max': 'Password must be at most 20 characters long',
});

const firstname = joi.string().messages({
	'string.base': 'Firstname must be a string',
});

const lastname = joi.string().messages({
	'string.base': 'Lastname must be a string',
});

const profilepic = joi.string().messages({
	'string.base': 'Profile picture must be a string',
});

const role = joi.string().valid('god', 'admin', 'guest').messages({
	'string.base': 'Role must be a string',
	'any.only': 'Role must be either god, admin or guest',
});

// const cart = joi.array().items(joi.number().integer().min(1)).messages({
// 	'array.base': 'Cart must be an array',
// 	'number.base': 'Cart items must be numbers',
// 	'number.integer': 'Cart items must be integers',
// 	'number.min': 'Cart items must be greater than 0',
// });

const createAndUpdateUserSchema = joi.object({
	email: email.required().messages({ 'any.required': 'Email is required' }),
	username: username
		.required()
		.messages({ 'any.required': 'Username is required' }),
	password: password
		.required()
		.messages({ 'any.required': 'Password is required' }),
	firstname: firstname
		.required()
		.messages({ 'any.required': 'Firstname is required' }),
	lastname: lastname
		.required()
		.messages({ 'any.required': 'Lastname is required' }),
	profilepic: profilepic,
	role: role.required().messages({ 'any.required': 'Role is required' }),
	//cart: cart.required().messages({ 'any.required': 'Cart is required' }),
});

const loginSchema = joi.object({
	username: username
		.required()
		.messages({ 'any.required': 'Username is required' }),
	password: password
		.required()
		.messages({ 'any.required': 'Password is required' }),
});

module.exports = { createAndUpdateUserSchema, loginSchema };
