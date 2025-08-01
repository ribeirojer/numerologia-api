import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
const env = await load();

const resendApiKey = env.RESEND_API_KEY || Deno.env.get("RESEND_API_KEY")!;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

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
