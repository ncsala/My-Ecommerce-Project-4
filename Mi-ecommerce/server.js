const {app} = require('./app')
const { sequelize } = require('./api/database/models');
//Test
const { loadingDataInTestingDB } = require('./api/test/helpers');

//if (process.env.NODE_ENV !== 'test') {
	app.listen(process.env.PORT, async () => {
		await sequelize.sync({ force: process.argv[2] === 'init' });

		if (process.argv[2] === 'load' || process.argv[3] === 'load') {
			await loadingDataInTestingDB();
		}

		console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
	});
//}



