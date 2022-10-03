function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data);
    if (error) {
      return res.status(400).json({ error: true, message: error.message });
    }
    next();
  };
}

module.exports = validatorHandler;