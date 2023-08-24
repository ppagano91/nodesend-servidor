const express = require("express");
const conectarDB = require("./config/db");

// Crear el servidor.
const app = express();

// Conectar a la base de datos.
conectarDB();

// Puerto de la app
const port = process.env.PORT || 3000;

// Habilitar express.json.
app.use(express.json({ extended: true }));

// Rutas de la app.
app.get("/", (req, res) => {
  res.json({ msg: "Hola mundo" });
});
app.use("/api/usuarios", require("./routes/usuarios"));

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Servidor levantado en puerto ${port}`);
});
