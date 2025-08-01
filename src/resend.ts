import { resendApiKey } from "./config.ts";

export const sendContactEmail = async (to: string[], html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "Numerologia <contato@flashcardspro.com.br>",
      to,
      subject: "Novo contato pelo site numerologia",
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error sending email: ${response.statusText}`);
  }

  return await response.json();
};
