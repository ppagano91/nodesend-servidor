exports.subirArchivo = async (req, res, next) => {
  console.log(req.file);
};

exports.eliminarArchivo = async (req, res) => {
  console.log(req.params.id);
};
