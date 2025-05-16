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
  const { nombre_original, nombre } = req.body;

  // Crear Objeto Enlace
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
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

// Obtiene un listado de todos los enlaces.
exports.todosEnlaces = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select("url -_id");
    res.json({ enlaces });
  } catch (error) {
    console.log(error);
  }
};

// Retorna si el enlace tiene password o no.
exports.tienePassword = async (req, res, next) => {
  const { url } = req.params;

  // Verificar si existe el enlace.
  const enlace = await Enlaces.findOne({ url });

  if (!enlace) {
    return res.status(404).json({ msg: `El link de descarga /${url} no existe o ha expirado` });
    // return next();
  }

  if (enlace.password) {
    return res.json({ password: true, enlace: enlace.url });
  }

  next();
};

// Verifica si el password es correcto.
exports.verificarPassword = async (req, res, next) => {
  const { url } = req.params;
  const { password } = req.body;

  // Consultar por el enlace.
  const enlace = await Enlaces.findOne({ url });

  // Verificar password
  if (bcrypt.compareSync(password, enlace.password)) {
    // Permitirle al usuario descargar el archivo.
    next();
  } else {
    return res.status(401).json({ msg: "Password Incorrecto" });
  }
};

exports.obtenerEnlace = async (req, res) => {
  console.log("Iniciando obtenerEnlace");

  let respondido = false;
  
  const responder = (statusCode, data) => {
    if (!respondido && !res.headersSent) {
      respondido = true;
      res.status(statusCode).json(data);
    }
  };
  
  try {
    const { url } = req.params;
    console.log(`Buscando enlace con URL: ${url}`);

    // Verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });
    console.log("Resultado de búsqueda:", enlace ? "Enlace encontrado" : "Enlace no encontrado");

    if (!enlace) {
      console.log("Enviando respuesta 404");
      // return responder(404, { msg: `El enlace ${url} no existe` });
      return res.status(404).json({ msg: `El link de descarga /${url} no existe o ha expirado` });
      // return responder(404, { msg: `El link de descarga /${url} no existe o ha expirado` });
    }
    else {
      console.log("Enviando respuesta con archivo");
      return res.json({ archivo: enlace.nombre, password: false });
    }
    
  } catch (error) {
    console.error("🔥 Error en obtenerEnlace:", error);
    console.log("Headers enviados:", res.headersSent);
    
    if (!res.headersSent) {
      console.log("Enviando respuesta de error 500");
      return res.status(500).json({ msg: "Hubo un error al procesar el enlace" });
    }
  }
};

