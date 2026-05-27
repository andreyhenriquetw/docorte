"use server"

export const sendWhatsappMessage = async ({
  number,
  text,
}: {
  number: string
  text: string
}) => {
  try {
    await fetch("http://host.docker.internal:8080/message/sendText/barber", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        apikey: "123456",
      },

      body: JSON.stringify({
        number,
        textMessage: {
          text,
        },
      }),
    })
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error)
  }
}
