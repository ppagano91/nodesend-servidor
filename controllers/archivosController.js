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
