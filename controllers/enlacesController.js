const Enlaces = require("../models/Enlace");
const shortid = require("shortid");

exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores.

  // Almacenar en la base de datos.
  const { nombre_original, password } = req.body;

  // Crear Objeto Enlace
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = shortid.generate();
  enlace.nombre_original = nombre_original;
  enlace.password = password;

  //   Almacenar en la base de datos.
  try {
    await enlace.save();
    res.json({ msg: `${enlace.url}` });
  } catch (error) {
    console.log(error);
  }

  // Si el usuario está autenticado.
};
