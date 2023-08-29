const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

// Crear el servidor.
const app = express();

// Conectar a la base de datos.
conectarDB();

// Habilitar cors.
const opcionesCors = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(opcionesCors));

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar express.json.
app.use(express.json({ extended: true }));

// Habilitar carpeta publica.
app.use(express.static("uploads"));

// Rutas de la app.
app.get("/", (req, res) => {
  res.json({ msg: "Hola mundo" });
});
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enlaces", require("./routes/enlaces"));
app.use("/api/archivos", require("./routes/archivos"));

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Servidor levantado en puerto ${port}`);
});
