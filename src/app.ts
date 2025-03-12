import 'dotenv/config'
import { createBot, MemoryDB, createProvider } from '@bot-whatsapp/bot'
import { BaileysProvider } from '@bot-whatsapp/provider-baileys'
import flows from './flows';

const main = async () => {

  const provider = createProvider(BaileysProvider)

  await createBot({
    database: new MemoryDB(),
    provider,
    flow: flows
  })
}

main()