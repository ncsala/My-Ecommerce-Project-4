const db = require('../database/models');

// /pictures?product=id
// Acción: Recupera la lista de pictures del product identificado con id. Responde con un array conteniendo las pictures.
// Response codes: // 200 OK.// 404 Not Found // 500 Server Error.
// POR QUERY VIENEN COMO STRING!
const getPictures = async (req, res, next) => {
	try {
		const productId = req.query.product;

		const productExists = await db.Product.findByPk(productId);

		if (!productExists) {
			return res.status(404).json({
				error: true,
				msg: 'Product not found',
			});
		}

		const picturesProduct = await db.Picture.findAll({
			where: {
				product_id: productId,
			},
		});

		if (!picturesProduct.length) {
			return res.status(404).json({
				error: true,
				msg: 'The product does not have images',
			});
		}

		res.status(200).json({
			error: false,
			msg: 'Product photo list',
			data: picturesProduct,
		});
	} catch (error) {
		next(error);
	}
};

// GET /pictures/:id
// Acción: Recupera la picture con el id solicitado. Responde con la información completa de la picture con el id buscado.
// Response codes: 200 OK.// 404 Not Found // 500 Server Error.
const getPicture = async (req, res, next) => {
	try {
		const pictureId = req.params.id;

		const picture = await db.Picture.findByPk(pictureId);

		if (!picture) {
			return res.status(404).json({ error: true, msg: 'Picture not found' });
		}

		res.status(200).json({
			error: false,
			msg: 'Picture found',
			data: picture,
		});
	} catch (error) {
		next(error);
	}
};

// POST /pictures
// Acción: Crea una nueva picture. Debe recibir un body con la info de la picture a crear.
// Responde con la info completa de la nueva picture.
// Response codes: // 201 Created.//400 Bad Request // 500 Server Error.
const createPicture = async (req, res, next) => {
	try {
		const { pictureUrl, pictureDescription, productId } = req.body;

		const productExist = await db.Product.findByPk(productId);

		if (!productExist) {
			return res.status(404).json({ error: true, msg: 'Product not found' });
		}

		const newPicture = await db.Picture.create({
			picture_url: pictureUrl,
			picture_description: pictureDescription,
			product_id: productId,
		});

    // if (!newPicture) {
    //   return res.status(400).json({ error: true, msg: 'Picture not created' });
    // }

		res.status(201).json({
			error: false,
			msg: 'Picture created',
			data: newPicture,
		});
	} catch (error) {
		next(error);
	}
};

// PUT /pictures/:id
// Acción: Actualiza la picture identificada con id. Debe recibir un body con la info de la picture a modificar.
// Responde con la info completa de la picture modificada.
// Response codes: // 200 OK. // 400 Bad Request // 404 Not Found (si no existe la picture con el id solicitado)
// 500 Server Error.
const updatePicture = async (req, res, next) => {
	try {
		const { pictureUrl, pictureDescription } = req.body;
		const pictureId = req.params.id;

		const picture = await db.Picture.findByPk(pictureId);

		if (!picture) {
			return res.status(404).json({ error: true, msg: 'Picture not found' });
		}

		let pictureUpdate = await db.Picture.update(
			{
				picture_url: pictureUrl,
				picture_description: pictureDescription,
			},
			{
				where: {
					picture_id: pictureId,
				},
			}
		);

    // if (!pictureUpdate) {
    //   return res.status(400).json({ error: true, msg: 'Picture not updated' });
    // }

		pictureUpdate = await db.Picture.findByPk(pictureId);

		res.status(200).json({
			error: false,
			msg: 'Picture updated',
			data: pictureUpdate,
		});
	} catch (error) {
		next(error);
	}
};

// DELETE /pictures/:id
// Acción: Eliminar la picture identificada con id. Responde con información sobre la eliminación realizada.
// Response codes:
// 200 OK. // 404 Not Found (si no existe la picture con el id solicitado) // 500 Server Error.
const deletePicture = async (req, res, next) => {
	try {
		const pictureId = req.params.id;

		let pictureExist = await db.Picture.findByPk(pictureId);

		if (!pictureExist) {
			return res.status(404).json({ error: true, msg: 'Picture not found' });
		}

		const pictureDeleted = await db.Picture.destroy({
			where: {
				picture_id: pictureId,
			},
		});

    // if (!pictureDeleted) {
    //   return res.status(400).json({ error: true, msg: 'Picture not deleted' });
    // }

		res
			.status(200)
			.json({ error: false, msg: 'Picture deleted', data: pictureExist });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getPictures,
	getPicture,
	createPicture,
	updatePicture,
	deletePicture,
};
