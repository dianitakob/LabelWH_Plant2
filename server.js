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


// Endpoint para imprimir etiqueta
app.post("/print", (req, res) => {
  const { PartNumber } = req.body;

  // Ruta del archivo .btw (ajústala según tu PC)
  // Ruta del archivo .btw (específica)
const btwPath = "C:/Users/dortiz/Documents/PINK LABELS/PINK_LABEL_V6_2016_BEV3_PRUEBA.btw";

  // Comando Bartender con variables PartNo y Description
  const cmd = `"C:\\Program Files\\Seagull\\BarTender 2022\\bartend.exe" /F="${btwPath}" /P /X /D="PartNumber=${PartNumber};" /PRN="${printer}"`;

  console.log("Ejecutando:", cmd);

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al imprimir: ${error.message}`);
      return res.status(500).send("Error al imprimir la etiqueta");
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    res.send("Etiqueta enviada a impresión");
  });
});



//app.listen(3004, () => console.log("API corriendo en http://localhost:3004"));
app.listen(3000, () => console.log("API corriendo en http://localhost:3000"));
