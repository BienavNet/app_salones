import { Validaciones } from "../assets/validation.js";
import { methods as database } from "./../database/database.js";
import { tokensMethods as tokens } from "./../functions.js";

const checkLogin = async (req, res) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Object.keys(req.body).length === 0
  )
    return res.status(400).json({
      status: "Bad Request.",
      message: "El cuerpo de la peticion no puede estar vacia.",
    });
  try {
    const { correo, contrasena, rol } = req.body;
    try {
      Validaciones.correo(correo);
      Validaciones.contrasena(contrasena);
      Validaciones.role(rol);
    } catch (validationError) {
      return res
        .status(400)
        .json({ status: "Bad Request", message: validationError.message });
    }
    const connection = await database.getConnection();
    const query =
      "SELECT id, nombre FROM persona WHERE correo = ? AND contrasena = ?";
    var result = await connection.query(query, [correo, contrasena]);
    if (result.length > 0) {
      const { id, nombre } = result[0];
      if (id !== undefined && id !== "") {
        var result = await connection.query(
          "SELECT id AS id_rol FROM " + rol + " WHERE persona = " + id + ""
        );
        if (result.length > 0) {
          const { id_rol } = result[0];
          if (id_rol !== undefined && id_rol !== "") {
            const token = tokens.signToken({
              nombre,
              user: correo,
              rol,
            });
            res.set({ Authorization: token });
            res.cookie("access_token", token, {
              httpOnly: true, // la cookie solo se puede acceder en el servidor
              sameSite: "strict", // la cookie solo se puede acceder en el mismo dominio
              maxAge: 1000 * 60 * 60, // la cookie tiene tiempo de valides de solo 1 hora
            });
            return res.status(200).json({
              status: "ok",
              message: "Login Correcto.!",
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
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  checkLogin,
};
