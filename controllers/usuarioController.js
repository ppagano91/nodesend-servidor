const Usuario = require("../models/Usuario");
const bcryptjs = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoUsuario = async (req, res) => {
  // Mostrar mensajes de error de express-validator.
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Verificar si el usuario ya está registrado.
  const { email, password } = req.body;

  let usuario = await Usuario.findOne({ email });

  if (usuario) {
    return res.status(400).json({ msg: "El usuario ya está registrado." });
  }

  // Crear un nuevo usuario.
  usuario = new Usuario(req.body);

  // Hashear el password.
  const salt = await bcryptjs.genSalt(10);
  usuario.password = await bcryptjs.hash(password, salt);

  try {
    // Guardar el usuario.
    await usuario.save();
    res.json({ msg: "Usuario creado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Hubo un error al crear el Usuario" });
  }
};
