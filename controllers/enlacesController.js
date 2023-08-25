const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores.
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

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

exports.obtenerEnlace = async (req, res, next) => {
  console.log(req.params.url);
  const { url } = req.params;

  // Verificar si existe el enlace.
  const enlace = await Enlaces.findOne({ url });

  if (!enlace) {
    res.status(404).json({ msg: "El enlace no existe." });
    return next();
  }

  // Si el enlace existe.
  res.json({ archivo: enlace.nombre, password: false });

  console.log(enlace);
};
