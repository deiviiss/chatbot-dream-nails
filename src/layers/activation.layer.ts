import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"

// Turn bot on or off
export default async (ctx: BotContext, { state, flowDynamic, endFlow }: BotMethods) => {
  const inputUser = ctx.body
    .toLocaleLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " "); // Remove all spaces

  const stateBotDreamNails = await state.get('isActiveBotDreamNails');
  const stateBotMiTiendaEnLinea = await state.get('isActiveBotMiTiendaEnLinea');

  // Activate Mi tienda en linea
  if (inputUser === 'mi tienda en linea') {
    await flowDynamic([{ body: `🛍 ¡Hola! Bienvenido a Mi Tienda en Línea .shop 😊`, delay: 1000 }]);
    await state.update({ isActiveBotMiTiendaEnLinea: true, isActiveBotDreamNails: false });
    // return endFlow;
  }

  if (inputUser === 'salir' && stateBotMiTiendaEnLinea) {
    await flowDynamic([{ body: `Hasta luego!`, delay: 1000 }]);
    await state.update({ isActiveBotMiTiendaEnLinea: false });
    return endFlow();
  }

  // Activate Dream Nails Studio
  if (inputUser === 'dream nails') {
    await flowDynamic([{ body: `🌟 ¡Hola Bella! Bienvenida a Dream Nails Studio. 😊`, delay: 1000 }]);
    await state.update({ isActiveBotDreamNails: true, isActiveBotMiTiendaEnLinea: false });
    // return endFlow;
  }

  if (inputUser === 'salir' && stateBotDreamNails) {
    await flowDynamic([{ body: `Hasta luego bella!`, delay: 1000 }]);
    await state.update({ isActiveBotDreamNails: false });
    return endFlow();
  }
}