function logErrors(err, req, res, next) {
	console.log(err);
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	res.status(500).json({
		error: true,
		msg: err.message,
	});
}

module.exports = {
  logErrors,
  clientErrorHandler,
};



