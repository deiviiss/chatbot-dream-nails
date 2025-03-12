import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import { getAIResponse } from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowSchedule } from "../flows/schedule.flow"
import { flowConfirm } from "../flows/confirm.flow"

//? If the bot is active, it redirects to the flow based on the client's intention.
export default async (_: BotContext, { state, gotoFlow, endFlow }: BotMethods) => {
  const isActiveBot = state.get('isActiveBot')

  if (!isActiveBot) {
    return endFlow()
  }

  const history = getHistoryParse(state)

  const PROMPT_INITIAL = `
Como una inteligencia artificial avanzada, tu tarea es analizar el contexto de una conversación relacionada con Dream Nails y determinar cuál de las siguientes acciones es la más adecuada a realizar:
--------------------------------------------------------
Historial de conversación:
{HISTORY}

Posibles acciones a realizar:
1. AGENDAR: Esta acción se debe realizar cuando el cliente exprese su deseo de programar una cita para alguno de nuestros servicios, cursos o workshops.
2. HABLAR: Esta acción se debe realizar cuando el cliente tenga consultas o necesite más información sobre nuestros servicios, cursos o workshops.
3. CONFIRMAR: Esta acción se debe realizar cuando se haya llegado a un acuerdo mutuo, proporcionando una fecha, día y hora exacta sin conflictos para la cita o reserva.
--------------------------------------------------------
Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.

Respuesta ideal (AGENDAR|HABLAR|CONFIRMAR):`
    .replace('{HISTORY}', history)

  const intentPrediction = await getAIResponse(PROMPT_INITIAL)

  if (intentPrediction.includes('HABLAR')) return gotoFlow(flowSeller)
  if (intentPrediction.includes('AGENDAR')) return gotoFlow(flowSchedule)
  if (intentPrediction.includes('CONFIRMAR')) return gotoFlow(flowConfirm)
}