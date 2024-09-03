export const getMostCommon = (items) => {
  const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
};

export const getThreeMostCommon = (data) => {
  console.log("data de getThreeMostCommon", data)
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

// const formatHour = (hour) => {
//   const ampm = hour >= 12 ? "PM" : "AM";
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:00 ${ampm}`;
// };

// export const calculateMostFrequentHourRange = (result) => {
//   try {
//   const horasAsignadas = result.flatMap((r) => {
//     try {
//       const startHour = new Date(`1970-01-01T${r.hora_inicio}Z`).getHours();
//       const endHour = new Date(`1970-01-01T${r.hora_fin}Z`).getHours();
//       if (endHour < startHour) {
//         return Array.from(
//           { length: 24 - startHour + endHour + 1 },
//           (_, i) => (startHour + i) % 24
//         );
//       }
//       return Array.from(
//         { length: endHour - startHour + 1 },
//         (_, i) => startHour + i
//       );
//     } catch (error) {
//       console.error("Error processing hours:", error);
//       return [];
//     }
//   });

//   // Contar horas
//   const hourRanges = {};
//   for (let i = 0; i < 24; i += 1) {
//     hourRanges[i] = 0;
//   }

//   horasAsignadas.forEach((hour) => {
//     hourRanges[hour]++;
//   });

//   // Determinar el rango de horas más frecuente
//   const sortedHours = Object.entries(hourRanges)
//     .sort((a, b) => b[1] - a[1])
//     .filter(([hour, count]) => count === Object.values(hourRanges).reduce((a, b) => Math.max(a, b), 0));

//   if (sortedHours.length > 0) {
//     const mostFrequentHour = parseInt(sortedHours[0][0]);
//     return `${formatHour(mostFrequentHour)} - ${formatHour(mostFrequentHour + 1)}`;
//   } else {
//     return "No data";
//   }
// } catch (error) {
//   console.error("Error calculating most frequent hour range:", error);
//   return "Error";
// }
// };
