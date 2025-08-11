const express = require("express");
const app = express();
const cors = require("cors");
const sql = require("mssql");

app.use(cors());

// Configuración SQL Server
const config = {
  user: 'materialcontrol',
  password: 'Panasonic2025',
  server: 'sam',            // tu servidor SQL Server
  database: 'SAPCP3',
  options: {
    encrypt: false,               // usualmente false en local
    trustServerCertificate: true // necesario si usas self-signed cert
  }
};

// Endpoint para materiales
app.get("/materials", async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT matnr, maktx FROM MAKT");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ ERROR al conectar o consultar:", err); // <-- esto mostrará más info
    res.status(500).send(err.message); // <-- manda el mensaje como respuesta
  }
});


app.listen(3004, () => console.log("API corriendo en http://localhost:3004"));
