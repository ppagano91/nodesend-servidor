const Enlaces = require("../models/Enlace");
const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");

exports.subirArchivo = async (req, res, next) => {
  const configuracionMulter = {
    limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + "/../uploads");
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    })),
  };

  const upload = multer(configuracionMulter).single("archivo");
  upload(req, res, async (error) => {
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log("error", error);
      return next();
    }
  });

  //   console.log(req.file);
  //   const { archivo } = req.files;
  //   const { nombre } = req.body;
  //   const enlace = shortid__WEBPACK_IMPORTED_MODULE_1___default.a.generate();
  //   const extension = archivo.name.split(".").pop();
  //   const tipos = ["png", "jpg", "jpeg", "gif", "svg"];
  //   if (!tipos.includes(extension)) {
  //     return next(new Error("Formato de archivo no válido."));
  //   }
  //   const nombreArchivo = `${shortid__WEBPACK_IMPORTED_MODULE_1___default.a.generate()}.${extension}`;
  //   try {
  //     const archivoSubido = await _models_Archivo__WEBPACK_IMPORTED_MODULE_0__[
  //       "default"
  //     ].create({
  //       nombre: nombreArchivo,
  //       nombreOriginal: nombre,
  //       enlace,
  //     });
  //     res.json({ archivo: archivoSubido.enlace });
  //   } catch (error) {
  //     console.log(error);
  //     return next(error);
  //   }
};

exports.eliminarArchivo = async (req, res) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    console.log(`Archivo ${req.archivo} eliminado`);
  } catch (error) {
    console.log(error);
  }
};

exports.descargar = async (req, res, next) => {
  //   Obtiene el enlace.
  const { archivo } = req.params;
  const enlace = await Enlaces.findOne({ nombre: archivo });

  const archivoDescarga = __dirname + "/../uploads/" + archivo;
  res.download(archivoDescarga);

  //   Eliminar el archivo y la entrada de la base de datos.
  // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo.
  const { descargas, nombre } = enlace;

  if (descargas === 1) {
    // Se pasa el nombre del enlace a req.archivo.
    req.archivo = nombre;

    // Eliminar la entrada de la base de datos.

    await Enlaces.findOneAndRemove(enlace.id);
    console.log(`Enlace ${req.params.url} eliminado.`);

    next();
  } else {
    // Si las descargas son > a 1 - Restar 1.
    enlace.descargas--;
    await enlace.save();
  }

  // Si el enlace existe.
  res.json({ archivo: enlace.nombre, password: false });
};
