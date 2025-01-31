import { Resend } from "resend";
import path from "path";
import { RESEND_API_KEY,EMAIL_DOMINIO} from "../config.js";
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resend = new Resend(RESEND_API_KEY);

const getHTMLTemplate = ( mensaje) => {
  return new Promise((resolve, reject) => {
    const template = path.join(__dirname, "template", "SendEmail.html");
    fs.readFile(template, "utf8", (err, data) => {
      if (err) { return reject(err)};
      const html = data.replace("{mensaje}", mensaje)
      resolve(html);
    });
  });
};

export default async function sendNotificationEmail({ nombre, correo, mensaje }) {
  try {
    const to = Array.isArray(correo) ? correo : [correo];
    const Html = await getHTMLTemplate(mensaje);
    const { error } = await resend.emails.send({
      from: EMAIL_DOMINIO,
      to:to,
      subject: "Tienes una nueva actualización sobre tu clases: ¡Revisa los Detalles!",
      html: Html,
    });

    if (error) {
      return console.error({ error });
    } else {
      console.log("Email enviado correctamente:");
    }
  } catch (error) {
    console.error("Error: X", error);
  }
}