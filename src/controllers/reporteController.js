import { getMostCommon, getThreeMostCommon } from "../assets/function.js";
import { methods as database } from "./../database/database.js";

<<<<<<< HEAD

const getReportes = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT reporte.*, clase.fecha FROM reporte, clase")

        if (result !== undefined) {
            res.status(200).json(result)
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
// estadistica de reportes
const getDocenteQMasComentariosHaRealizado = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
  SELECT persona.cedula, COUNT(reporte.id) AS cantidad_comentarios
FROM reporte
JOIN clase ON reporte.clase = clase.id
JOIN horario ON clase.horario = horario.id
JOIN docente ON horario.docente = docente.id
JOIN persona ON docente.persona = persona.id
GROUP BY persona.cedula
ORDER BY cantidad_comentarios DESC
LIMIT 3`);
    console.log("getDocenteQMasComentariosHaRealizado", result);
    if (result !== undefined) {
      return res.status(200).json(result);
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
const getsalonMasComentarioTiene = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
SELECT salon.numero_salon, COUNT(reporte.id) AS cantidad_comentarios
FROM reporte
JOIN clase ON reporte.clase = clase.id
JOIN salon ON clase.salon = salon.id
GROUP BY salon.numero_salon
ORDER BY cantidad_comentarios DESC
LIMIT 3;`);
    console.log("getsalonMasComentarioTiene", result);
    if (result !== undefined) {
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
const getSalonMasUtilizado = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
SELECT salon.numero_salon, COUNT(clase.id) AS cantidad_usos
FROM clase
JOIN salon ON clase.salon = salon.id
GROUP BY salon.numero_salon
ORDER BY cantidad_usos DESC
LIMIT 3;`);
    console.log("getSalonMasUtilizado", result);
    if (result !== undefined) {
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
const getSalonMenosUtilizado = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
SELECT salon.numero_salon, COUNT(clase.id) AS cantidad_usos
FROM clase
JOIN salon ON clase.salon = salon.id
GROUP BY salon.numero_salon
ORDER BY cantidad_usos ASC
LIMIT 3;`);
    console.log("getSalonMenosUtilizado", result);
    if (result !== undefined) {
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getCantidadDiaMasAsignado = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
SELECT dia AS dia, COUNT(dia) AS cantidad_repeticiones
FROM detalle_horario
GROUP BY dia
ORDER BY cantidad_repeticiones DESC
LIMIT 3;`);
    console.log("getCantidadDiaMasAsignado", result);
    if (result !== undefined) {
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getRangeHoursMasFrecuente = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
WITH RECURSIVE Horas AS (
    SELECT
        id,
        hora_inicio,
        hora_fin,
        HOUR(hora_inicio) AS hora
    FROM detalle_horario
    UNION ALL
    SELECT
        id,
        hora_inicio,
        hora_fin,
        hora + 1
    FROM Horas
    WHERE hora < HOUR(hora_fin)
),
Intervalos AS (
    SELECT DISTINCT
        CONCAT(LPAD(hora, 2, '0'), ':00:00') AS hora_inicio,
        CONCAT(LPAD(hora + 1, 2, '0'), ':00:00') AS hora_fin
    FROM Horas
    WHERE hora < 23 -- Asegurarse de no exceder las 24 horas
),
Contador AS (
    SELECT
        i.hora_inicio,
        i.hora_fin,
        COUNT(*) AS cantidad_repeticiones
    FROM Intervalos i
    JOIN detalle_horario d
    ON i.hora_inicio >= HOUR(d.hora_inicio) AND i.hora_fin <= HOUR(d.hora_fin)
    GROUP BY i.hora_inicio, i.hora_fin
)
SELECT 
    hora_inicio,
    hora_fin,
    SUM(cantidad_repeticiones) AS cantidad_repeticiones
FROM Contador
GROUP BY hora_inicio, hora_fin
ORDER BY cantidad_repeticiones DESC
LIMIT 3;
`);
    console.log("getRangeHoursMasFrecuente", result);
    if (result !== undefined) {
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
// const getStatistics = async (req, res) => {
//   try {
//     const connection = await database.getConnection();
//     const result = await connection.query(`
// SELECT reporte.*, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, clase.fecha, clase.estado, horario.asignatura, horario.id, persona.nombre, persona.apellido, persona.cedula, salon.nombre AS nombre_salon, salon.numero_salon, salon.INTernet, salon.tv
// FROM reporte
// JOIN clase ON reporte.clase = clase.id
// JOIN horario ON clase.horario = horario.id
// JOIN detalle_horario ON horario.id = detalle_horario.horario
// JOIN docente ON horario.docente = docente.id
// JOIN persona ON docente.persona = persona.id
// JOIN salon ON clase.salon = salon.id`);
//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "No data found." });
//     }
// console.log("result",result);
//     // 1. Docente que más comentarios ha realizado
//     const comentariosPorDocente = result.map((r) => r.cedula);
//     const docenteMasComentarios = getMostCommon(comentariosPorDocente);
//     console.log("response 1 :", docenteMasComentarios);

//     // 2. Salón que más comentarios tiene
//     const comentariosPorSalon = result.map((r) => r.numero_salon);
//     const salonMasComentarios = getMostCommon(comentariosPorSalon);
//     console.log("response 2 :", salonMasComentarios);

//     // 3. Salón más utilizado
//     const usoPorSalon = result.map((r) => r.numero_salon);
//     const salonMasUtilizado = getMostCommon(usoPorSalon);
//     console.log("response 3 :", salonMasUtilizado);

//     // 4. Salón menos utilizado
//     const salonUsageCount = usoPorSalon.reduce((acc, salon) => {
//       acc[salon] = (acc[salon] || 0) + 1;
//       return acc;
//     }, {});
//     const salonMenosUtilizado = Object.keys(salonUsageCount).reduce((a, b) =>
//       salonUsageCount[a] < salonUsageCount[b] ? a : b
//     );
//     console.log("response 4 :", salonMenosUtilizado);

//     // 6. los primero 3 Día más ocupados
//     // const diasAsignados = result.map((r) => r.dia);
//     const diaMasAsignado = getThreeMostCommon(result);

//     const formatHour = (hour) => {
//       const ampm = hour >= 12 ? "PM" : "AM";
//       const hour12 = hour % 12 || 12;
//       return `${hour12}:00 ${ampm}`;
//     };
//     const horasAsignadas = result.flatMap((r) => {
//       try {
//         const startHour = new Date(`1970-01-01T${r.hora_inicio}Z`).getHours();
//         const endHour = new Date(`1970-01-01T${r.hora_fin}Z`).getHours();
//         if (endHour < startHour) {
//           return Array.from(
//             { length: 24 - startHour + endHour + 1 },
//             (_, i) => (startHour + i) % 24
//           );
//         }
//         return Array.from(
//           { length: endHour - startHour + 1 },
//           (_, i) => startHour + i
//         );
//       } catch (error) {
//         console.error("Error processing hours:", error);
//         return [];
//       }
//     });

//     const hourRanges = {};
//     for (let i = 0; i < 24; i += 1) {
//       hourRanges[i] = 0;
//     }

//     horasAsignadas.forEach((hour) => {
//       hourRanges[hour]++;
//     });

//     const hourRangeCounts = Object.entries(hourRanges).map(([hour, count]) => ({
//       hour,
//       count,
//     }));

//     const mostFrequentHour = getMostCommon(hourRangeCounts.map((h) => h.hour));
//     const mostFrequentHourCount = hourRanges[mostFrequentHour];

//     const startRange = mostFrequentHour;
//     const endRange =
//       Object.keys(hourRanges).find(
//         (hour) =>
//           hourRanges[hour] !== undefined &&
//           hourRanges[hour] < mostFrequentHourCount
//       ) || 23;

//     const horaMasAsignada = `${formatHour(startRange)} - ${formatHour(
//       Number(endRange) + 1
//     )}`;

//     const estadisticas = {
//       docenteMasComentarios,
//       salonMasComentarios,
//       salonMasUtilizado,
//       salonMenosUtilizado,
//       horaMasAsignada,
//       diaMasAsignado,
//     };
//     console.log("result the statics", estadisticas);
//     return res.status(200).json(estadisticas);
//   } catch (error) {
//     res.status(500).send("Internal Server Error: " + error.message);
//   }
// };

const getReportes = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
        SELECT reporte.*, clase.fecha, clase.estado, horario.asignatura, horario.id, persona.nombre, persona.apellido, persona.cedula, salon.nombre AS nombre_salon, salon.numero_salon, salon.INTernet, salon.tv
        FROM reporte 
        JOIN clase ON reporte.clase = clase.id 
        JOIN horario ON clase.horario = horario.id
        JOIN docente ON horario.docente = docente.id
        JOIN persona ON docente.persona = persona.id 
        JOIN salon ON clase.salon = salon.id`);
    if (result !== undefined) {
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getReporteBySupervisor = async (req, res) => {
<<<<<<< HEAD
    try {
        if (req.params !== undefined) {
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase WHERE clase.supervisor = " + id + " ")

            if (result !== undefined) {
                res.status(200).json(result)
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      const connection = await database.getConnection();
      const result = await connection.query(
        `
SELECT reporte.*, clase.fecha, clase.estado, horario.asignatura, horario.id, persona.nombre, persona.apellido, persona.cedula, salon.nombre AS nombre_salon, salon.numero_salon,salon.INTernet, salon.tv
FROM reporte 
JOIN clase ON reporte.clase = reporte.clase 
JOIN horario ON clase.horario = clase.horario
JOIN docente ON horario.docente = docente.id
JOIN persona ON docente.persona = persona.id 
JOIN salon ON clase.salon = clase.salon
WHERE clase.supervisor = ?`,
        [id]
      );
      console.log("result report backend", result);
      if (result !== undefined) {
        return res.status(200).json(result);
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

//👀
const getReporteByClase = async (req, res) => {
<<<<<<< HEAD
    try {
        if (req.params !== undefined) {
            const { clase } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT reporte.*, clase.fecha FROM reporte WHERE reporte.clase = " + clase + " ")

            if (result !== undefined) {
                res.status(200).json(result)
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
  try {
    if (req.params !== undefined) {
      const { clase } = req.params;

      const connection = await database.getConnection();
      const result = await connection.query(`
        SELECT reporte.* 
        FROM  reporte 
        WHERE reporte.clase =`,[clase]);
      if (result !== undefined) {
        res.status(200).json(result);
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

//👀
const getReporteBySalon = async (req, res) => {
<<<<<<< HEAD
    try {
        if (req.params !== undefined) {
            const { salon } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase WHERE clase.salon = " + salon + " ")

            if (result !== undefined) {
                res.status(200).json(result)
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
  try {
    if (req.params !== undefined) {
      const { salon } = req.params;

      const connection = await database.getConnection();
      const result = await connection.query(`
       SELECT reporte.* 
       FROM  reporte 
       JOIN  clase ON clase.id = reporte.clase 
       WHERE clase.salon =`,[salon]);

      if (result !== undefined) {
        res.status(200).json(result);
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const registrarReporte = async (req, res) => {
<<<<<<< HEAD
    try {
        if (req.body !== undefined) {
=======
  try {
    if (req.body !== undefined) {
      const { clase, comentario } = req.body;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477

      if (clase !== undefined && comentario !== undefined) {
        const connection = await database.getConnection();
        const result = await connection.query(
          "INSERT INTO reporte SET ?",
          req.body
        );

<<<<<<< HEAD
            if (clase !== undefined && comentario !== undefined) {
                const connection = await database.getConnection()
                const result = await connection.query("INSERT INTO reporte SET ?", req.body)

                const { affectedRows } = result

                if (affectedRows == 1) {
                    res.status(200).json({ "status": "ok", "message": "Datos almacenados correctamente en el servidor." })
                    return
                }
                res.status(400).json({ "status": "error", "message": "Bad request." })
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
        const { affectedRows } = result;

        if (affectedRows == 1) {
          res.status(200).json({
            status: "ok",
            message: "Datos almacenados correctamente en el servidor.",
          });
          return;
        }
        res.status(400).json({ status: "error", message: "Bad request." });
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const deleteReporte = async (req, res) => {
<<<<<<< HEAD
    try {
        if (req.params !== undefined) {
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE reporte WHERE reporte.id = " + id + "")
=======
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      const connection = await database.getConnection();
      const result = await connection.query(
        "DELETE reporte WHERE reporte.id = " + id + ""
      );
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477

      const { affectedRows } = result;

<<<<<<< HEAD
            if (affectedRows == 1) {
                res.status(200).json({ "status": "ok", "message": "Datos eliminados correctamente en el servidor." })
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
      if (affectedRows == 1) {
        res.status(200).json({
          status: "ok",
          message: "Datos eliminados correctamente en el servidor.",
        });
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const updateReporte = async (req, res) => {
<<<<<<< HEAD
    try {
        if (req.params !== undefined && req.body !== undefined) {
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("UPDATE reporte SET ? WHERE reporte.id = " + id + "")
            const { affectedRows } = result

            if (affectedRows == 1) {
                res.status(200).json({ "status": "ok", "message": "Datos actualizados correctamente en el servidor." })
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

// README 

// Filtro para cada seleccionar los reportes dependiendo si lo quiere hacer por salon o si lo quiere hacer por supervisor
// o tambien puede hacer ambas
// EL USO ES EL SIGUIENTE: localhost:5000/api/reporte/supervisor/(aqui va la cedula del supervisor o si no la va a a usar poner un 0)/salon/(igual, el id del salon o si no se usa un 0)
// localhost:5000/api/reporte/supervisor/1005054932/salon/3

const filterBySupAndSal = async (req, res) => {
    try {
        if (req.params !== undefined) {

            const { cedula, salon } = req.params
            const connection = await database.getConnection()

            let query = ""

            if (cedula != 0 && salon != 0) {
                query = "SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase JOIN supervisor ON supervisor.id = clase.supervisor JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " + cedula + " AND clase.salon= " + salon + ""
            } else if (cedula != 0 && salon == 0) {
                query = "SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase JOIN supervisor ON supervisor.id = clase.supervisor JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " + cedula + ""
            }else if ( cedula == 0 && salon != 0){
                query = "SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase WHERE clase.salon = " +salon+ ""
            }else{
                res.status(400).json({ "status": "error", "message": "Bad request." })
                return
            }

            const result = await connection.query(query)


            if (result !== undefined) {
                res.status(200).json(result)
                return
            }

            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }
        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
=======
  try {
    if (req.params !== undefined && req.body !== undefined) {
      const { id } = req.params;

      const connection = await database.getConnection();
      const result = await connection.query(
        "UPDATE reporte SET ? WHERE reporte.id = " + id + ""
      );
      const { affectedRows } = result;

      if (affectedRows == 1) {
        res.status(200).json({
          status: "ok",
          message: "Datos actualizados correctamente en el servidor.",
        });
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
<<<<<<< HEAD
    getReportes,
    getReporteByClase,
    getReporteBySalon,
    getReporteBySupervisor,
    registrarReporte,
    updateReporte,
    deleteReporte,
    filterBySupAndSal
}
=======
  getSalonMenosUtilizado,
  getSalonMasUtilizado,
  getsalonMasComentarioTiene,
  getDocenteQMasComentariosHaRealizado,getCantidadDiaMasAsignado,getRangeHoursMasFrecuente,
  getReportes,
  getReporteByClase,
  getReporteBySalon,
  getReporteBySupervisor,
  registrarReporte,
  updateReporte,
  deleteReporte,
};
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
