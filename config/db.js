const mongoose = require("mongoose");

// Para que el archivo .env sea leído por el servidor y así poder acceder a las variables de entorno que contiene.
require("dotenv").config({ path: ".env" });

// Conexión a la base de datos.
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      // Para evitar warnings en la consola.
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("=".repeat(50));
    console.log("Base de datos conectada.");
    console.log("=".repeat(50));
  } catch (error) {
    console.log(error);
    process.exit(1); // Detener la app.
  }
};

module.exports = conectarDB;
