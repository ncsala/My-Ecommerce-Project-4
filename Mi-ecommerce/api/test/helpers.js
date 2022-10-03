const { generateJWT } = require('../../helpers/generateJWT');

const generateToken = async (role) => {
	return await generateJWT({
		role: role,
	});
};

module.exports = { generateToken };
