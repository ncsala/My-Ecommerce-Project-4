const jwt = require('jsonwebtoken');

// Generar JWT, recibe un objeto con la información que se quiere guardar en el token
// y una palabra secreta que se usa para firmar el token
// Tambien recibe un objeto con la configuración del token
// y un callback que se ejecuta cuando el token se ha generado
const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '5d',
      algorithm: 'HS256',
    },
    (err, token) => {
      if (err) {
        // console.log(err);
        reject('Failed to generate JWT');
      }
      else resolve(token)
    });
  });
}

module.exports = {generateJWT};
