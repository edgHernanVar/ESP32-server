"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const procesarDatos_1 = require("./procesamiento/procesarDatos");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
const uploadsDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
// POST: Recibe el JSON del ESP32
app.post('/api/recibir-datos', (req, res) => {
    const data = req.body;
    if (!Array.isArray(data)) {
        res.status(400).json({ error: 'Formato inválido. Se esperaba un arreglo JSON.' });
        return;
    }
    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const archivoPath = path_1.default.join(uploadsDir, `${fechaHoy}.json`);
    try {
        const jsonGuardado = JSON.stringify(data, null, 2);
        fs_1.default.writeFileSync(archivoPath, jsonGuardado);
        console.log(`Archivo guardado como ${archivoPath}`);
        res.status(200).json({ mensaje: 'Datos guardados correctamente.' });
    }
    catch (error) {
        console.error('Error al guardar archivo:', error);
        res.status(500).json({ error: 'Error al guardar archivo.' });
    }
});
// GET: Devuelve estadísticas por fecha
app.get('/api/estadisticas/:fecha', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = req.params.fecha;
    const archivoPath = path_1.default.join(uploadsDir, `${fecha}.json`);
    if (!fs_1.default.existsSync(archivoPath)) {
        res.status(404).json({ error: 'Archivo no encontrado para la fecha proporcionada.' });
        return;
    }
    try {
        const contenido = yield fs_1.default.promises.readFile(archivoPath, 'utf-8');
        const datos = JSON.parse(contenido);
        const estadisticas = (0, procesarDatos_1.procesarEstadisticas)(datos);
        res.json(estadisticas);
    }
    catch (error) {
        console.error('Error al procesar estadísticas:', error);
        res.status(500).json({ error: 'No se pudieron procesar los datos.' });
    }
}));
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
