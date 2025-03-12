const apiKey = process.env.API_KEY
const url = `${process.env.URL}${apiKey}`

export async function getAIResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    })

    const data = await response.json()

    // Extract the response from the model
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no tengo una respuesta en este momento.'
  } catch (error) {
    console.error('Error al llamar a Gemini API:', error)
    return 'Hubo un problema al procesar tu solicitud.'
  }
}
