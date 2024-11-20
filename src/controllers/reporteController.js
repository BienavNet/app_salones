import { getMostCommon, getThreeMostCommon } from "../assets/function.js";
import { connection } from "./../database/database.js";



// Hace una consulta y genera un reporte, en este caso envia los salones que mas se han utilizado en orden descendente
const getSalonMasUtilizado = async (req, res) => {
  try {
    
    const [result] = await connection.query(`
SELECT salon.numero_salon, COUNT(clase.id) AS cantidad_usos
FROM clase
JOIN salon ON clase.salon = salon.id
GROUP BY salon.numero_salon
ORDER BY cantidad_usos DESC
LIMIT 3;`);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "not found room more used" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Hace una consulta y genera un reporte, en este caso envia los salones que mas se han utilizado en orden ascendente
const getSalonMenosUtilizado = async (req, res) => {
  try {
    
    const [result] = await connection.query(`
SELECT salon.numero_salon, COUNT(clase.id) AS cantidad_usos
FROM clase
JOIN salon ON clase.salon = salon.id
GROUP BY salon.numero_salon
ORDER BY cantidad_usos ASC
LIMIT 3;`);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "no found room less used" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Hace una consulta y genera un reporte, en este caso envia los dias de la semana que mas se han utilizado en orden descendente
const getCantidadDiaMasAsignado = async (req, res) => {
  try {
    const [result] = await connection.query(`
SELECT dia AS dia, COUNT(dia) AS cantidad_repeticiones
FROM detalle_horario
GROUP BY dia
ORDER BY cantidad_repeticiones DESC
LIMIT 3;`);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "not found days asigned" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Hace una consulta y genera un reporte, en este caso envia las horas que mas frecuentes
const getRangeHoursMasFrecuente = async (req, res) => {
  try {
    
    const [result] = await connection.query(`
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
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "not found hour more frecuencies" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};


// Hace una consulta y genera un reporte, en este caso envia los docentes que mas comentarios han hecho, en orden descendente
const getDocenteQMasComentariosHaRealizado = async (req, res) => {
  try {
    
    const [result] = await connection.query(`
              SELECT persona.cedula, COUNT(reporte.id) AS cantidad_comentarios
            FROM reporte
            JOIN clase ON reporte.clase = clase.id
            JOIN horario ON clase.horario = horario.id
            JOIN docente ON horario.docente = docente.id
            JOIN persona ON docente.persona = persona.id
            GROUP BY persona.cedula
            ORDER BY cantidad_comentarios DESC
            LIMIT 3`);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "not found teacher more comments made" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Obtiene los reportes realizados por los supervisores
const getReportes = async (req, res) => {
  try {
    
    const [result] = await connection.query(`
          SELECT reporte.id AS reporte_id, reporte.*, clase.fecha, clase.estado, horario.asignatura, horario.id, persona.nombre, persona.apellido, persona.cedula, salon.nombre AS nombre_salon, salon.numero_salon, salon.INTernet, salon.tv
          FROM reporte 
          JOIN clase ON reporte.clase = clase.id 
          JOIN horario ON clase.horario = horario.id
          JOIN docente ON horario.docente = docente.id
          JOIN persona ON docente.persona = persona.id 
          JOIN salon ON clase.salon = salon.id`);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "not found all report" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Hace una consulta y genera un reporte, en este caso envia los salones que mas comentarios han recibido en orden descendente
const getsalonMasComentarioTiene = async (req, res) => {
  try {
    
    const [result] = await connection.query(`
SELECT salon.numero_salon, COUNT(reporte.id) AS cantidad_comentarios
FROM reporte
JOIN clase ON reporte.clase = clase.id
JOIN salon ON clase.salon = salon.id
GROUP BY salon.numero_salon
ORDER BY cantidad_comentarios DESC
LIMIT 3;`);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "not found classroom more comment has" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Obtiene todos los reportes realizados por algun supervisor mediante su cedula
const getReporteBySupervisor = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      
      const [result] = await connection.query(
        `
SELECT 
reporte.comentario,
  reporte.id AS reporte_id,          
  clase.id AS clase_id,           
  clase.fecha, 
  clase.estado, 
  horario.asignatura, 
  horario.id AS horario_id, 
  persona.nombre, 
  persona.apellido, 
  persona.cedula, 
  salon.nombre AS nombre_salon, 
  salon.numero_salon, 
  salon.internet, 
  salon.tv,
  supervisor.id AS supervisor_id   
FROM reporte 
JOIN clase ON reporte.clase = clase.id
JOIN horario ON clase.horario = horario.id
JOIN docente ON horario.docente = docente.id 
JOIN persona ON docente.persona = persona.id
JOIN salon ON clase.salon = salon.id
JOIN supervisor ON clase.supervisor = supervisor.id
WHERE clase.supervisor = ?`,
        [id]
      );
      if (result.length > 0) {
        return res.status(200).json(result);
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Obtiene todos los reportes realizados por algun supervisor si el id coincide con el id de la clase
const getReporteByClase = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { clase } = req.params;
      const [result] = await connection.query(
        `
        SELECT reporte.*, horario.asignatura, salon.nombre AS nombre_salon, salon.numero_salon, persona.nombre, persona.apellido, clase.estado, clase.fecha
        FROM  reporte 
        JOIN clase ON reporte.clase = clase.id
        JOIN horario ON clase.horario = horario.id
        JOIN salon ON clase.salon = salon.id 
        JOIN docente ON horario.docente = docente.id
       JOIN persona ON docente.persona = persona.id 
        WHERE reporte.clase = ?
        `,
        [clase]
      );
      if (result) {
        return res.status(200).json(result);
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Obtiene todos los reportes realizados por algun supervisor si el id coincide con el id del salon
const getReporteBySalon = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { salon } = req.params;
      const [result] = await connection.query(
        `
      SELECT reporte.*, clase.estado,salon.numero_salon, clase.fecha, horario.asignatura, persona.nombre, persona.apellido
FROM reporte
JOIN clase ON clase.id = reporte.clase
JOIN horario ON clase.horario = horario.id
JOIN salon ON clase.salon = salon.id
JOIN docente ON horario.docente = docente.id
JOIN persona ON docente.persona = persona.id
WHERE clase.salon = ?`,
        [salon]
      );

      if (result.length > 0) {
        res.status(200).json(result);
        return;
      }
      res.status(404).json({ status: "error", message: "report classroom not found." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Registra un nuevo registro en la tabla reporte
const registrarReporte = async (req, res) => {
  try {
    if (req.body !== undefined) {
      const { clase, comentario } = req.body;
      const estado = req.params.estado;

      if (clase !== undefined && comentario !== undefined &&  estado !== undefined) {
        console.log(" la clase del registrar reporte para el supervisor es:", clase)
        console.log(" estoad:", estado)
        const [status] = await connection.query("UPDATE clase SET estado = ? WHERE clase.id = ?;", [estado, clase])
       console.log(" status:", status)
        const { affectedRows}  = status;
        console.log(" affected rows:", affectedRows)
        console.log("req.body: ", req.body)
        if (affectedRows == 1) {
          console.log("req.body:2 ", req.body)
          const [result] = await connection.query(
            "INSERT INTO reporte SET ?",
            req.body
          );
          console.log("req.body3: ", req.body)
          console.log(" result:", result);
  
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
        } else {
          res.status(400).send({ status: "error", message: "clase no found." });
        }
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Elimina un registro preexistente de la tabla reporte
const deleteReporte = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      
      const [result] = await connection.query(
        "DELETE reporte WHERE reporte.id = " + id + ""
      );

      const { affectedRows } = result;

      if (affectedRows == 1) {
        res.status(200).json({
          status: "ok",
          message: "Datos eliminados correctamente en el servidor.",
        });
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Actualiza un registro preexistente de la tabla reporte
const updateReporte = async (req, res) => {
  try {
    if (req.params !== undefined && req.body !== undefined) {
      const { id } = req.params;

      
      const [result] = await connection.query(
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
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// README

// Filtro para cada seleccionar los reportes dependiendo si lo quiere hacer por salon o si lo quiere hacer por supervisor
// o tambien puede hacer ambas
// EL USO ES EL SIGUIENTE: localhost:5000/api/reporte/supervisor/(aqui va la cedula del supervisor o si no la va a a usar poner un 0)/salon/(igual, el id del salon o si no se usa un 0)
// localhost:5000/api/reporte/supervisor/1005054932/salon/3


// Filtra los reportes si se pasan los parametros cedula del supervisor y/o id del salon
const filterBySupAndSal = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula, salon } = req.params;
      let query = "";

      if (cedula != 0 && salon != 0) {
        query =
          "SELECT reporte.id AS reporte_id, reporte.clase, reporte.comentario, clase.estado, clase.fecha, salon.nombre AS nombre_salon, salon.numero_salon, salon.capacidad, horario.asignatura, persona_docente.nombre AS nombre_docente, persona_docente.apellido AS apellido_docente, docente.id AS docente_id FROM reporte JOIN clase ON clase.id = reporte.clase JOIN salon ON clase.salon = salon.id JOIN horario ON clase.horario = horario.id JOIN docente ON docente.id = horario.docente JOIN persona AS persona_docente ON persona_docente.id = docente.persona JOIN supervisor ON supervisor.id = clase.supervisor JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " +
          cedula + " AND clase.salon = " + salon + "";
      } else if (cedula != 0 && salon == 0) {
        query =
          "SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase JOIN supervisor ON supervisor.id = clase.supervisor JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " +
          cedula +
          "";
      } else if (cedula == 0 && salon != 0) {
        query =
          "SELECT reporte.*, clase.fecha FROM reporte JOIN clase ON clase.id = reporte.clase WHERE clase.salon = " +
          salon +
          "";
      } else {
        res.status(400).json({ status: "error", message: "Bad request." });
        return;
      }

      const [result] = await connection.query(query);

      if (result.length > 0) {
        res.status(200).json(result);
        return;
      }

      res.status(404).json({ status: "error", message: "Not found." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  getSalonMenosUtilizado,
  getSalonMasUtilizado,
  getsalonMasComentarioTiene,
  getDocenteQMasComentariosHaRealizado,
  getCantidadDiaMasAsignado,
  getRangeHoursMasFrecuente,
  getReportes,
  getReporteByClase,
  getReporteBySalon,
  getReporteBySupervisor,
  registrarReporte,
  updateReporte,
  deleteReporte,
  filterBySupAndSal,
};
