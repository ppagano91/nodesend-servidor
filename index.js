const express = require("express");
const conectarDB = require("./config/db");

// Crear el servidor.
const app = express();

// Conectar a la base de datos.
conectarDB();

app.use(express.static("public"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor levantado en puerto ${port}`);
});
