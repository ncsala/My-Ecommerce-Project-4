const db = require('../api/database/models');

//se le pasa un id de categoria y si existe devuelve true sino false
const existeCat = (id) => {
	let cat = db.Category.findByPk(id);

	if (cat) {
		return true;
	}

	return false;
};

module.exports = {
	existeCat,
};
