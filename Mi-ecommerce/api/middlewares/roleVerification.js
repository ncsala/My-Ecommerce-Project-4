// Respuesta generica
function response(res) {
	return res.status(401).json({
		error: true,
		msg: 'You are not authorized to access this resource',
	});
}

function roleVerification(...roles) {
	return (req, res, next) => {
		const auth = roles.find((roles) => roles === req.newUsers.role);

		if (!auth)
			response(res)
		else {
			next();
		}
	};
}

module.exports = roleVerification;
