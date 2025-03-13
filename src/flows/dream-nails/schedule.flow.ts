import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

import { getFullCurrentDate } from "src/utils/currentDate";
import { getHistoryParse, handleHistory } from "src/utils/handleHistory";
import { getAIResponse } from "src/services/ai";
import { generateTimer } from "src/utils/generateTimer";
import { getCurrentCalendar } from "src/services/calendar";

const PROMPT_SCHEDULE = `
Como ingeniero de inteligencia artificial especializado en la programación de citas para Dream Nails, tu objetivo es analizar la conversación y determinar la intención del cliente de agendar una cita para alguno de nuestros servicios, cursos o workshops. La cita puede ser para reservar un servicio de uñas, inscribirse en un curso o workshop, o solicitar una consulta.

DETALLES DE LAS CITAS:
- Para servicios profesionales (Manos de ensueño, Pies impecables y Retiros Profesionales), la cita tendrá una duración aproximada de 210 minutos.
- Para cursos y workshops, la cita/inscripción puede variar según la modalidad, pero es necesario confirmar disponibilidad.
- Las citas se pueden programar de lunes a sábados de 09:00 a 18:00, y domingos de 10:00 a 14:00.
- Solo se pueden agendar citas para la semana en curso.
- Cada cita dura 210 minutos (3 horas y 30 minutos), por lo que si un horario solicitado invade un espacio reservado, se debe rechazar y sugerir otro.
- Antes de confirmar un horario, asegúrate de que ninguna parte de la cita se superponga con otro espacio reservado.
- La siguiente sugerencia de horario debe iniciar después de la última cita reservada en el mismo día.

Ejemplos de casos
- Si hay un reserva para un día en particular a las 10 am y el usuario solicita una cita a las 11 am, la siguiente sugerencia de horario sería a las 13:30 ya que el espacio reservado de las 10am dura 3 horas y 30 minutos.
- Si el usuario pide una cita a las 9am tampoco se acepta, ya que la cita dura 3 horas y 30 minutos y se estaría encimando el espacio reservado de las 10am.
- Si el usuario sigue sin aceptar la sugerencia, sugerir otro horario o día dentro de la semana.
- No responder con este tipo de respuestas "a las 9:00 no es posible porque tu cita duraría hasta las 12:30 y tengo un espacio reservado a las 10:00" 

Fecha de hoy: {CURRENT_DAY}

Citas ya agendadas:
-----------------------------------
{AGENDA_ACTUAL}

Historial de Conversación:
-----------------------------------
{HISTORIAL_CONVERSACION}

Ejemplos de respuestas adecuadas para sugerir horarios y verificar disponibilidad:
----------------------------------
Claro, tengo un espacio disponible mañana para un servicio de uñas, ¿a qué hora te resulta mejor? 😊
Sí, tengo disponibilidad hoy para tu cita, ¿cuál es el horario que prefieres? 🤔
Por supuesto, hay varios espacios disponibles esta semana para cursos y workshops, por favor indícame el día y la hora que te conviene. 👍
Ese horario ya está reservado, pero tengo espacio disponible a las 13:30 o más tarde. ¿Cuál prefieres? 😊

INSTRUCCIONES:
- NO saludar.
- Si existe disponibilidad, pide confirmación al usuario.
- Revisa detalladamente el historial de conversación y determina el día, fecha y hora sin conflictos con citas ya agendadas.
- Las respuestas deben ser breves y directas, ideales para enviar por WhatsApp, e incluir emojis de forma sutil.

-----------------------------
Respuesta útil en primera persona:
`;


const generateSchedulePrompt = (summary: string, history: string) => {
  const nowDate = getFullCurrentDate();
  const mainPrompt = PROMPT_SCHEDULE
    .replace("{AGENDA_ACTUAL}", summary)
    .replace("{HISTORIAL_CONVERSACION}", history)
    .replace("{CURRENT_DAY}", nowDate);

  return mainPrompt;
};

// Flow for scheduling appointments
const flowSchedule = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { state, flowDynamic }) => {
    await flowDynamic("Dame un momento para consultar la agenda...");
    const history = getHistoryParse(state);
    const listAppointments = await getCurrentCalendar();
    const promptSchedule = generateSchedulePrompt(listAppointments?.length ? listAppointments : "ninguna", history);

    // Calling custom API to get AI response
    const userMessage = ctx.body; // The user's message that needs to be answered

    const assistantReply = await getAIResponse(`${promptSchedule}Cliente pregunta: ${userMessage}`);

    // Managing chat history
    await handleHistory({ content: assistantReply, role: 'assistant' }, state);

    // Split the response into chunks and send them with a small delay between each one
    const chunks = assistantReply.split(/(?<!\d)\.\s+/g); // Divide by periods followed by a space
    for (const chunk of chunks) {
      await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
    }
  });

export { flowSchedule };
