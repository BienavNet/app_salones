import { Validaciones } from "../assets/validation.js";
import { connection } from "./../database/database.js";
import { tokensMethods as tokens } from "./../functions.js";


// Revisa las variables y las consulta en la respectiva tabla, dependiendo del rol y si coincide todo envia un mensaje de respuesta correcto y crea los token y las cookies para permitir el inicio de sesion
const checkLogin = async (req, res) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Object.keys(req.body).length === 0
  ) {
    return res.status(400).json({
      status: "Bad Request.",
      message: "El cuerpo de la petición no puede estar vacío.",
    });
  }

  try {
    const { correo, contrasena, rol } = req.body;
    // Validaciones
    try {
      Validaciones.correo(correo);
      Validaciones.contrasena(contrasena);
      Validaciones.role(rol);
    } catch (validationError) {
      return res
        .status(400)
        .json({ status: "Bad Request", message: validationError.message });
    }

    // Ejecutar la consulta para verificar usuario
    const query =
      "SELECT id, nombre, cedula FROM persona WHERE correo = ? AND contrasena = ?";
    const [result] = await connection.query(query, [correo, contrasena]);

    // Verificar si se encontró algún usuario
    if (result.length > 0) {
      const { id, nombre, cedula } = result[0];

      if (id !== undefined && id !== "") {
        // Ejecutar la consulta para verificar el rol
        const roleQuery = `SELECT id AS id_rol FROM ${rol} WHERE persona = ?`;
        const [roleResult] = await connection.query(roleQuery, [id]);

        if (roleResult.length > 0) {
          const { id_rol } = roleResult[0];
          let directorId;
          if (["docente", "supervisor"].includes(rol)) {
            const directorQuery = "SELECT persona FROM director LIMIT 1";
            const [directorResult] = await connection.query(directorQuery);
            if (directorResult.length > 0) {
              directorId = directorResult[0].persona;
            }

          }
          if (id_rol !== undefined && id_rol !== "") {
            // Generar el token
            const token = tokens.signToken({
              id,
              cedula,
              nombre,
              user: correo,
              rol,
              directorId
            });

            // Configurar las cookies y la cabecera de autorización
            res.set({ Authorization: token });
            res.cookie("access_token", token, {
              httpOnly: true,
              sameSite: "strict",
              maxAge: 1000 * 60 * 60, // 1 hora
            });

            return res.status(200).json({
              status: "ok",
              message: "Login Correcto.",
              access_token: token,
            });
          }
        }

        return res
          .status(400)
          .json({ status: "error", message: "Error al determinar el rol." });
      }
    } else {
      return res
        .status(401)
        .json({ status: "Bad Request", message: "Credenciales incorrectas." });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  checkLogin,
};
