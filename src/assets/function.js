export const getMostCommon = (items) => {
  const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

export const getThreeMostCommon = (data) => {
 // Crea un objeto para contar las ocurrencias de cada día
 const count = data.reduce((acc, item) => {
  const dia = item.dia;
  if (dia) { // Asegúrate de que 'dia' no sea undefined o null
    acc[dia] = (acc[dia] || 0) + 1;
  }
  return acc;
}, {});

// Ordena el objeto basado en los valores (cantidad de asignaciones)
const sortedDias = Object.entries(count)
  .sort(([, a], [, b]) => b - a) // Ordena en orden descendente por valores
  .slice(0, 3); // Toma los 3 primeros elementos

// Devuelve el array de días junto con sus valores para el gráfico
return sortedDias.map(([dia, cantidad]) => ({ dia, cantidad }));
};