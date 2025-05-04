let chart;

async function consultarFecha() {
  const input = document.getElementById('fecha');
  const fecha = input.value;

  if (!fecha) {
    document.getElementById('error').textContent = 'Selecciona una fecha válida.';
    return;
  }

  try {
    const res = await fetch(`/api/estadisticas/${fecha}`);
    if (!res.ok) throw new Error(`Error ${res.status}: No se pudo obtener datos`);
    
    const data = await res.json();

    if (data.total_activaciones === 0) {
      document.getElementById('error').textContent = 'No hay datos disponibles para esta fecha.';
    }

    document.getElementById('activaciones').textContent = data.total_activaciones ?? 'N/A';
    document.getElementById('minima').textContent = data.distancia_minima ?? 'N/A';
    document.getElementById('maxima').textContent = data.distancia_maxima ?? 'N/A';
    document.getElementById('promedio').textContent = data.distancia_promedio ?? 'N/A';
    document.getElementById('error').textContent = '';

    // Agrega los datos al gráfico
    actualizarGrafico([data.distancia_minima, data.distancia_promedio, data.distancia_maxima]);
    
  } catch (err) {
    document.getElementById('error').textContent = 'No se encontraron estadísticas para esa fecha.';
    console.error(err);
  }
}

function actualizarGrafico(valores) {
  const ctx = document.getElementById('lineChart').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mínima', 'Promedio', 'Máxima'],
      datasets: [{
        label: 'Distancias (cm)',
        data: valores,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById('fecha').value = hoy;
  consultarFecha();
});
