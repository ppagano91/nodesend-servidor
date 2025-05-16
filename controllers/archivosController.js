const Enlaces = require("../models/Enlace");
const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const path = require("path");

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

exports.eliminarArchivo = async (req, res, next) => {
  try {
    const rutaArchivo = path.join(__dirname, `../uploads/${req.archivo}`);

    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    next();
  } catch (error) {
    // console.error("Error al eliminar archivo:", error);
    return res.status(500).json({
      msg: "Error al eliminar archivo",
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
        }
    });
    // next();
  }
};

exports.descargar = async (req, res, next) => {
  try {
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo });

    if (!enlace) {
      return res.status(404).json({ msg: "El enlace no existe" });
    }

    const archivoDescarga = path.join(__dirname, `../uploads/${archivo}`);
    res.download(archivoDescarga, async (err) => {
      if (err) return res.status(500).end();
      req.archivo = enlace.nombre;
      await Enlaces.findByIdAndRemove(enlace.id);
      next();
  });
  } catch (error) {
    res.status(500).json({
      msg: "Hubo un error al procesar la descarga",
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
        }
    });
  }
};
