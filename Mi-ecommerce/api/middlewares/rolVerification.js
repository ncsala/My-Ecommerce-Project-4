// Respuesta generica
function response(res) {
	return res.status(401).json({
		error: true,
		msg: 'You are not authorized to access this resource',
	});
}

//Funcion de verificacion de roles de usuario
// const rolVerification = {
// 	// Verifica si es tanto admin, guest o god
// 	generic: function (req, res, next) {
// 		if (
// 			req.newUsers.role !== 'admin' &&
// 			req.newUsers.role !== 'guest' &&
// 			req.newUsers.role !== 'god'
// 		) {
// 			response(res);
// 		}

// 		next();
// 	},

// 	// Verifica si es admin o god
// 	admin: function (req, res, next) {
// 		if (req.newUsers.role !== 'admin' && req.newUsers.role !== 'god') {
// 			response(res);
// 		}

// 		next();
// 	},

// 	// Verifica si es god
// 	god: function (req, res, next) {
// 		if (req.newUsers.role !== 'god') {
// 			response(res);
// 		}

// 		next();
// 	},
// };

// const roleVerification = (...roles) => {
// 	if (
// 		req.newUsers.role !== 'admin' &&
// 		req.newUsers.role !== 'guest' &&
// 		req.newUsers.role !== 'god'
// 	) {
// 		response(res);
// 	}

// 	next();
// };

function roleVerification(...roles) {
	return (req, res, next) => {
		const auth = roles.find((roles) => roles === req.newUsers.role);
    console.log(auth)

    console.log(req.newUsers.role)

		if (!auth)
			response(res)
		else {
			next();
		}
	};
}

module.exports = roleVerification;
