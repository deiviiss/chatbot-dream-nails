# Integrated ChatBot for Dream Nails and MiTiendaEnLínea.shop

This project is a WhatsApp ChatBot that integrates two functionalities:

- **Dream Nails Studio**: An internal bot for demonstrations (appointment scheduling, courses, and workshops).
- **MiTiendaEnLínea.shop**: The main bot that provides information and helps schedule meetings for digital marketing, e-commerce, chatbots, web design, and landing pages.

The ChatBot uses the [@bot-whatsapp/bot](https://github.com/codigoencasa/builderbot) library and integrates with an Artificial Intelligence API (Gemini) to interpret user intentions and dynamically redirect the conversation flow.

---

## Features

- **Keyword Activation**

  - _Dream Nails_: Internally activated with the keyword `dream nails`.
  - _MiTiendaEnLínea.shop_: Activated by the user with the keyword `mi tienda en linea`.

- **Modular Architecture**

  - **Activation Layer**: Detects the keyword, activates the bot, and displays a welcome message.
  - **Main Layer**: Checks the bot’s state and redirects based on the user's intention.
  - **Conversational Layer**: Uses predefined prompts and the AI API to predict the intention (SCHEDULE, TALK, or CONFIRM) and directs the conversation to the appropriate flow.

- **Integration with External Services**

  - _Dream Nails_: Integration with Google Calendar and Google Sheets for appointment management.
  - _MiTiendaEnLínea_: Provides information on marketing plans, e-commerce, and digital solutions.

- **Logging and Debugging**
  - Extensive use of `console.log` to trace the flow and detect issues in each ChatBot layer.

---

## Project Structure

```plaintext
.
├── flows
│   ├── dream-nails
│   │   ├── seller.flow.ts       // Flow for handling inquiries (seller) in Dream Nails
│   │   ├── schedule.flow.ts     // Flow for scheduling appointments in Dream Nails
│   │   └── confirm.flow.ts      // Flow for confirming appointments in Dream Nails
│   └── mi-tienda-en-linea
│       ├── seller.flow.ts       // Flow for handling inquiries (seller) in MiTiendaEnLínea.shop
│       ├── schedule.flow.ts     // Flow for scheduling meetings in MiTiendaEnLínea.shop
│       └── confirm.flow.ts      // Flow for confirming meetings in MiTiendaEnLínea.shop
├── services
│   ├── ai.ts                    // AI service for processing and predicting user intentions
│   └── calendar.ts              // Service for Google Calendar integration
├── utils
│   ├── handleHistory.ts         // Utility to manage conversation history
│   └── generateTimer.ts         // Utility to generate dynamic message delays
├── activation.layer.ts          // Activation and welcome layer
├── main.layer.ts                // Main layer: redirects based on the user's intention
└── README.md
```
