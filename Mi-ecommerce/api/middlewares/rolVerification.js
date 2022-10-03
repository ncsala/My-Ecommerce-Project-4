// Respuesta generica
function response(res) {
	return res.status(401).json({
		error: true,
		msg: 'You are not authorized to access this resource',
	});
}

//Funcion de verificacion de roles de usuario
const rolVerificationMiddleware = {
  // Verifica si es tanto admin, guest o god
	generic: function (req, res, next) {
		if (
			req.newUsers.role !== 'admin' &&
			req.newUsers.role !== 'guest' &&
			req.newUsers.role !== 'god'
		) {
			response(res);
		}

		next();
	},

  // Verifica si es admin o god
	admin: function (req, res, next) {
		if (req.newUsers.role !== 'admin' && req.newUsers.role !== 'god') {
			response(res);
		}

		next();
	},

  // Verifica si es god
	god: function (req, res, next) {
		if (req.newUsers.role !== 'god') {
			response(res);
		}

		next();
	},
};

module.exports = rolVerificationMiddleware;
