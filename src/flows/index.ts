import { createFlow } from "@bot-whatsapp/bot";
import welcomeFlow from "./welcome.flow";
import { flowSeller as flowSellerDreamNails } from "./dream-nails/seller.flow";
import { flowSchedule as flowScheduleDreamNails } from "./dream-nails/schedule.flow";
import { flowConfirm as flowConfirmDreamNails } from "./dream-nails/confirm.flow";
import { flowSeller as flowSellerMiTienda } from "./mi-tienda-en-linea/seller.flow";
import { flowSchedule as flowScheduleMiTienda } from "./mi-tienda-en-linea/schedule.flow";
import { flowConfirm as flowConfirmMiTienda } from "./mi-tienda-en-linea/confirm.flow";

// We declare all the flows that we are going to use
export default createFlow([welcomeFlow, flowSellerDreamNails, flowScheduleDreamNails, flowConfirmDreamNails, flowSellerMiTienda, flowScheduleMiTienda, flowConfirmMiTienda])