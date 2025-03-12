import { createFlow } from "@bot-whatsapp/bot";
import welcomeFlow from "./welcome.flow";
import { flowSeller } from "./seller.flow";
import { flowSchedule } from "./schedule.flow";
import { flowConfirm } from "./confirm.flow";

// We declare all the flows that we are going to use
export default createFlow([welcomeFlow, flowSeller, flowSchedule, flowConfirm])