const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const { route } = require("./usuarios");

router.post(
  "/",
  [
    check("email", "Agrega un email válido.").isEmail(),
    check("password", "El password debe tener al menos 6 caracteres.").isLength(
      { min: 6 }
    ),
  ],
  authController.autenticarUsuario
);

router.get("/", authController.usuarioAutenticado);

module.exports = router;
