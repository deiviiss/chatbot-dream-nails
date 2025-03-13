import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import { getAIResponse } from "../../services/ai";
import { clearHistory, handleHistory, getHistoryParse } from "../../utils/handleHistory";
import { getFullCurrentDate } from "../../utils/currentDate";
import { appToCalendar } from "src/services/calendar";
import { flowSchedule as flowScheduleMiTienda } from "./schedule.flow";


const createConfirmationPrompt = (message) => {
  const prompt = `
    Analiza el siguiente mensaje y determina si el usuario está confirmando una cita:

    Mensaje: "${message}"

    Si el mensaje indica confirmación de una cita, responde con "confirmado".
    Si el mensaje no es una confirmación, responde con "cancelado".

    Respuesta:
  `;
  return prompt;
}


const generatePromptToFormatDate = (history: string) => {
  const prompt = `Fecha de Hoy:${getFullCurrentDate()}, Basado en el Historial de conversación: 
    ${history}
    ----------------
    Formato esperado: dd de febrero a las hh:mm am/pm`

  return prompt
}

const createEventJsonPrompt = (info: string) => {
  const prompt = `tu tarea principal es analizar la información proporcionada en el contexto y generar un objeto que se adhiera a la estructura especificada.
  - Formatea la fecha y hora en formato "yyyy/mm/dd hh:mm:ss".
  - Devuelve solo el objeto, sin texto adicional, sin etiquetas de código y sin explicaciones.

    Contexto: "${info}"
    
    Estructura de respuesta esperada:
    {
        "name": "David Hilera",
        "starDate": "yyyy/mm/dd 00:00:00",
        "email": "fef@fef.com",
        "phone": "9812345678"
    }
    
    Responde solo con el objeto, sin agregar comentarios ni formato adicional.`

  return prompt
}

// Responsible for requesting the necessary data to register the event in the calendar
const flowConfirm = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic }) => {
  await flowDynamic('Ok, voy a pedirte unos datos para agendar')
  await flowDynamic('¿Cuál es tu nombre?')
}).addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
  await state.update({ name: ctx.body })

  const history = getHistoryParse(state)
  const friendlyDateTime = await getAIResponse(generatePromptToFormatDate(history))

  await handleHistory({ content: friendlyDateTime, role: 'assistant' }, state)
  await flowDynamic(`¿Me confirmas fecha y hora? ${friendlyDateTime}`)
  await state.update({ starDate: friendlyDateTime })
})
  .addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const userConfirmation = await getAIResponse(createConfirmationPrompt(ctx.body))
    console.log('userConfirmation', userConfirmation)

    if (userConfirmation.includes('confirmado')) {
      console.log('userConfirmation', userConfirmation)
      await flowDynamic(`Última pregunta ¿Cuál es tu email?`)
      return
    }

    gotoFlow(flowScheduleMiTienda)
    endFlow()
  })
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(ctx.body);

    if (!isValidEmail) {
      return await flowDynamic([{ body: `Opción no reconocida. Por favor, escribe un email válido. 😊`, delay: 1000 }])
    }

    const currentYear = new Date().getFullYear()
    const infoCustomer = `Name: ${state.get('name')}, StarDate: ${state.get('starDate')} year: ${currentYear}, phone: ${ctx.from} email: ${ctx.body}`

    const eventDataJson = await getAIResponse(createEventJsonPrompt(infoCustomer))

    await appToCalendar(eventDataJson)
    clearHistory(state)
    await flowDynamic('Listo! agendado. Buen día')
  })

export { flowConfirm }