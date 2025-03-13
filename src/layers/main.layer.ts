import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import { getAIResponse } from "../services/ai"

import { flowSeller as flowSellerDreamNails } from "../flows/dream-nails/seller.flow"
import { flowSchedule as flowScheduleDreamNails } from "../flows/dream-nails/schedule.flow"
import { flowConfirm as flowConfirmDreamNails } from "../flows/dream-nails/confirm.flow"

import { flowSeller as flowSellerMiTienda } from "../flows/mi-tienda-en-linea/seller.flow";
import { flowSchedule as flowScheduleMiTienda } from "../flows/mi-tienda-en-linea/schedule.flow";
import { flowConfirm as flowConfirmMiTienda } from "../flows/mi-tienda-en-linea/confirm.flow";

//? If the bot is active, it redirects to the flow based on the client's intention.
export default async (_: BotContext, { state, gotoFlow, endFlow }: BotMethods) => {
  const isActiveBotDreamNails = await state.get("isActiveBotDreamNails");
  const isActiveBotMiTiendaEnLinea = await state.get("isActiveBotMiTiendaEnLinea");

  if (!isActiveBotDreamNails && !isActiveBotMiTiendaEnLinea) {
    return endFlow();
  }

  const history = getHistoryParse(state)

  if (isActiveBotMiTiendaEnLinea) {
    const PROMPT_MI_TIENDA_EN_LINEA = `
      Como una inteligencia artificial avanzada, tu tarea es analizar el contexto de una conversación relacionada con MiTiendaEnLínea.shop y determinar cuál de las siguientes acciones es la más adecuada a realizar:
    --------------------------------------------------------
    Historial de conversación:
    {HISTORY}

    Posibles acciones a realizar:
    1. AGENDAR: Esta acción se debe realizar cuando el cliente exprese su deseo de programar una *reunión o presentación* para discutir cómo mejorar su negocio con nuestras soluciones digitales (marketing, ecommerce, chatbots, etc.).
    2. HABLAR: Esta acción se debe realizar cuando el cliente tenga consultas o necesite más información sobre nuestros *planes de marketing digital, diseño web, ecommerce, chatbots o landing pages*.
    3. CONFIRMAR: Esta acción se debe realizar cuando se haya llegado a un acuerdo mutuo, proporcionando una fecha, día y hora exacta sin conflictos para la *reunión o presentación*.
    --------------------------------------------------------
    Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.

    Respuesta ideal (AGENDAR|HABLAR|CONFIRMAR):`
      .replace("{HISTORY}", history);

    const intentPrediction = await getAIResponse(PROMPT_MI_TIENDA_EN_LINEA)

    if (intentPrediction.includes('HABLAR')) return gotoFlow(flowSellerMiTienda)
    if (intentPrediction.includes('AGENDAR')) return gotoFlow(flowScheduleMiTienda)
    if (intentPrediction.includes('CONFIRMAR')) return gotoFlow(flowConfirmMiTienda)
  }

  if (isActiveBotDreamNails) {
    const PROMPT_DREAM_NAILS = `
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

    const intentPrediction = await getAIResponse(PROMPT_DREAM_NAILS)

    if (intentPrediction.includes('HABLAR')) return gotoFlow(flowSellerDreamNails)
    if (intentPrediction.includes('AGENDAR')) return gotoFlow(flowScheduleDreamNails)
    if (intentPrediction.includes('CONFIRMAR')) return gotoFlow(flowConfirmDreamNails)
  }
}
