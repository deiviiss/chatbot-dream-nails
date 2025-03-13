import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

import { getFullCurrentDate } from "src/utils/currentDate";
import { getHistoryParse, handleHistory } from "src/utils/handleHistory";
import { getAIResponse } from "src/services/ai";
import { generateTimer } from "src/utils/generateTimer";
import { getCurrentCalendar } from "src/services/calendar";

const PROMPT_SCHEDULE = `
Como asistente virtual de MiTiendaEnLínea.shop, tu objetivo es analizar la conversación y determinar la intención del cliente de agendar una cita para discutir nuestros servicios de marketing digital, ecommerce, chatbots, o landing pages. La cita puede ser para reservar una reunión para conocer más sobre nuestros planes o servicios.

DETALLES DE LAS CITAS:
- Las citas para consultas sobre marketing, ecommerce, chatbots o landing pages se realizan en sesiones de 30 a 60 minutos.
- Las citas pueden agendarse de lunes a viernes de 09:00 a 18:00.
- Solo se pueden agendar citas para la semana en curso.
- Si el horario solicitado está ocupado, se debe sugerir otro horario o día dentro de la misma semana.

Ejemplos de casos:
- Si hay una cita a las 10:00 am y el usuario solicita una cita a las 11:00 am, la siguiente sugerencia de horario sería a las 12:00 pm o más tarde, según la disponibilidad.
- Si el usuario pide una cita a las 9:00 am, no se acepta ya que la cita anterior ocupa ese espacio.
- Si el usuario sigue sin aceptar la sugerencia, proponer otros horarios disponibles dentro de la semana.

Fecha de hoy: {CURRENT_DAY}

Citas ya agendadas:
-----------------------------------
{AGENDA_ACTUAL}

Historial de Conversación:
-----------------------------------
{HISTORIAL_CONVERSACION}

Ejemplos de respuestas adecuadas para sugerir horarios y verificar disponibilidad:
----------------------------------
Claro, tengo un espacio disponible mañana para discutir nuestros servicios, ¿a qué hora te viene mejor? 😊
Sí, tengo disponibilidad hoy para tu consulta, ¿qué horario prefieres? 🤔
Tengo varios espacios disponibles esta semana para hablar sobre marketing o ecommerce, ¿cuál te conviene más? 👍
Ese horario ya está reservado, pero tengo espacio disponible a las 12:00 o más tarde. ¿Te gustaría esa opción? 😊

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
