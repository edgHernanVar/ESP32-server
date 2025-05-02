const axios = require('axios');

const url = 'http://localhost:3000/api/recibir-datos';

const datos = [
  {
    id_dispositivo: 'ESP32-TEST',
    timestamp: new Date().toISOString(),
    distancia_cm: 37
  }
];
console.log(JSON.toISOString(datos[0].timestamp));
axios.post(url, datos)
  .then(response => {
    console.log('Respuesta del servidor:', response.data);
  })
  .catch(error => {
    if (error.response) {
      console.error('Error del servidor:', error.response.status, error.response.data);
    } else {
      console.error('Error de conexión:', error.message);
    }
  });
