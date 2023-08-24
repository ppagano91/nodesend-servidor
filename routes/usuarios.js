const express = require("express");

const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

// Crea un usuario.
router.post("/", (req, res) => {
  usuarioController.nuevoUsuario(req, res);
});

module.exports = router;
