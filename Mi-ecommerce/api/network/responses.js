
function responses(res, status, error = '', message = '', data = {}) {
  return res.status(status).json({
    error,
    message,
    data
  })
}

module.exports = responses;