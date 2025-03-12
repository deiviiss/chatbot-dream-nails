import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"

// Turn bot on or off
export default async (ctx: BotContext, { state, flowDynamic, endFlow }: BotMethods) => {
  const inputUser = ctx.body.toLocaleLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (inputUser === 'dream nails') {
    await flowDynamic([{ body: `🌟 ¡Hola Bella! Bienvenida a Dream Nails Studio. 😊`, delay: 1000 }]);
    await state.update({ isActiveBot: true });
    return endFlow;
  }

  if (inputUser === 'salir') {
    await flowDynamic([{ body: `Hasta luego bella!`, delay: 1000 }]);
    await state.clear();
    return endFlow();
  }
}