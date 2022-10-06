const db = require('../api/database/models');

//se le pasa un id de categoria y si existe devuelve true sino false
const existeCat = async (id) => {
	let cat = await db.Category.findByPk(id);
	console.log(cat);
	if (cat != null) {
		return true;
	}
	return false;
};

module.exports = {
	existeCat,
};
