const jwt = require('jsonwebtoken');
const { SECRETORPRIVATEKEY } = process.env;

const extractToken = (req) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(' ')[0] === 'Bearer'
	) {
		return req.headers.authorization.split(' ')[1];
	}
	return null;
};

const verifyJWT = (req, res, next) => {
	try {
		// Se obtiene el token del header
		// const { authorization: token } = req.headers;
		const token = extractToken(req);
		if (!token) {
			return res.status(401).json({
        error: true,
				msg: 'No token provided',
			});
		}

		const decoded = jwt.verify(token, SECRETORPRIVATEKEY);

		req.newUsers = decoded;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
      error: true,
			msg: 'Invalid token',
		});
	}
};

module.exports = { verifyJWT, extractToken };
