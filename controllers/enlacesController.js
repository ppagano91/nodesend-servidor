const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores.

  // Almacenar en la base de datos.
  const { nombre_original } = req.body;

  // Crear Objeto Enlace
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = shortid.generate();
  enlace.nombre_original = nombre_original;

  // Si el usuario está autenticado.
  if (req.usuario) {
    const { password, descargas } = req.body;

    // Asignar a enlace el número de descargas.
    if (descargas) {
      enlace.descargas = descargas;
    }

    // Asignar un password.
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }

    // Asignar el autor.
    enlace.autor = req.usuario.id;
  }

  //   Almacenar en la base de datos.
  try {
    await enlace.save();
    res.json({ msg: `${enlace.url}` });
  } catch (error) {
    console.log(error);
  }

  // Si el usuario está autenticado.
};
