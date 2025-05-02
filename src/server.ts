import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { procesarEstadisticas, DatoSensor } from './procesamiento/procesarDatos';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// POST: Recibe el JSON del ESP32
app.post('/api/recibir-datos', (req: Request, res: Response): void => {
  const data = req.body;

  if (!Array.isArray(data)) {
    res.status(400).json({ error: 'Formato inválido. Se esperaba un arreglo JSON.' });
    return;
  }

  const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const archivoPath = path.join(uploadsDir, `${fechaHoy}.json`);

  try {
    const jsonGuardado = JSON.stringify(data, null, 2);
    fs.writeFileSync(archivoPath, jsonGuardado);
    console.log(`Archivo guardado como ${archivoPath}`);
    res.status(200).json({ mensaje: 'Datos guardados correctamente.' });
  } catch (error) {
    console.error('Error al guardar archivo:', error);
    res.status(500).json({ error: 'Error al guardar archivo.' });
  }
});

// GET: Devuelve estadísticas por fecha
app.get('/api/estadisticas/:fecha', async (req: Request, res: Response): Promise<void> => {
    const fecha = req.params.fecha;
    const archivoPath = path.join(uploadsDir, `${fecha}.json`);
  
    if (!fs.existsSync(archivoPath)) {
      res.status(404).json({ error: 'Archivo no encontrado para la fecha proporcionada.' });
      return;
    }
  
    try {
      const contenido = await fs.promises.readFile(archivoPath, 'utf-8');
      const datos: DatoSensor[] = JSON.parse(contenido);
  
      const estadisticas = procesarEstadisticas(datos);
      res.json(estadisticas);
    } catch (error) {
      console.error('Error al procesar estadísticas:', error);
      res.status(500).json({ error: 'No se pudieron procesar los datos.' });
    }
  });

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
