const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

exports.autenticarUsuario = async (req, res, next) => {
  // Revisar si hay errores.
  // Buscar el usuario para ver si está registrado.
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });
  console.log(usuario);

  if (!usuario) {
    res.status(401).json({ msg: "El usuario no existe." });
    return next();
  }

  // Verificar el password y autenticar el usuario.
  if (bcrypt.compareSync(password, usuario.password)) {
    res.status(200).json({ msg: "El usuario se autenticó correctamente." });
  } else {
    res.status(401).json({ msg: "Password incorrecto." });
    return next();
  }
};

exports.usuarioAutenticado = async (req, res, next) => {};
