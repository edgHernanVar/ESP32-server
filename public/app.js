async function consultarFecha() {
    const input = document.getElementById('fecha');
    const fecha = input.value;
    console.log(fecha)
  
    if (!fecha) {
      document.getElementById('error').textContent = 'Selecciona una fecha válida.';
      return;
    }
  
    try {
      const res = await fetch(`/api/estadisticas/${fecha}`);
  
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo obtener datos`);
      }
      
  
      const data = await res.json();
      
      if (data.total_activaciones === 0) {
        document.getElementById('error').textContent = 'No hay datos disponibles para esta fecha.';
      }
      
      document.getElementById('activaciones').textContent = data.total_activaciones ?? 'N/A';
      document.getElementById('minima').textContent = data.distancia_minima ?? 'N/A';
      document.getElementById('maxima').textContent = data.distancia_maxima ?? 'N/A';
      document.getElementById('promedio').textContent = data.distancia_promedio ?? 'N/A';
      
  
      document.getElementById('error').textContent = '';
    } catch (err) {
      document.getElementById('error').textContent = 'No se encontraron estadísticas para esa fecha.';
      console.error(err);
    }
  }
  
  // Opcional: cargar estadísticas de hoy al abrir
  document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById('fecha').value = hoy;
    consultarFecha();
  });
  