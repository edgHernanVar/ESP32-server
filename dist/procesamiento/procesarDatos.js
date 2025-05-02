"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarEstadisticas = procesarEstadisticas;
function procesarEstadisticas(datos) {
    if (datos.length === 0) {
        return {
            total_activaciones: 0,
            distancia_minima: 0,
            distancia_maxima: 0,
            distancia_promedio: 0
        };
    }
    const distancias = datos.map(d => d.distancia_cm);
    const total = distancias.length;
    const min = Math.min(...distancias);
    const max = Math.max(...distancias);
    const promedio = distancias.reduce((acc, val) => acc + val, 0) / total;
    return {
        total_activaciones: total,
        distancia_minima: min,
        distancia_maxima: max,
        distancia_promedio: parseFloat(promedio.toFixed(2))
    };
}
