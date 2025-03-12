import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import activationLayer from "src/layers/activation.layer";
import conversationalLayer from "src/layers/conversational.layer";
import mainLayer from "src/layers/main.layer";

export default addKeyword(EVENTS.WELCOME)
  .addAction(activationLayer)
  .addAction(conversationalLayer)
  .addAction(mainLayer)