export interface DatoSensor {
    id_dispositivo: string;
    timestamp: string;
    distancia_cm: number;
  }
  
  export interface Estadisticas {
    total_activaciones: number;
    distancia_minima: number;
    distancia_maxima: number;
    distancia_promedio: number;
  }
  
  export function procesarEstadisticas(datos: DatoSensor[]): Estadisticas {
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
  