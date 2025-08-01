import { Application, Router } from "jsr:@oak/oak";
import { supabase } from "./src/supabase.ts";
import { NumerologiaData } from "./src/types.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { sendContactEmail } from "./src/resend.ts";

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Bem-vindo à API de Numerologia!";
});

router.post("/api/save", async (ctx) => {
  try {
    const data = await ctx.request.body.json() as NumerologiaData;
    console.log("Dados recebidos:", data);

    const requiredFields = [
      "name",
      "birthdate",
      "numeroDoDestino",
      "numerologiaNome",
    ];
    for (const field of requiredFields) {
      if (!data[field as keyof NumerologiaData]) {
        ctx.response.status = 400;
        ctx.response.body = { error: `Campo ${field} é obrigatório` };
        return;
      }
    }

    const { data: insertedData, error } = await supabase
      .from("tabela_numerologia")
      .insert([{
        nome: data.name,
        data_nascimento: data.birthdate,
        numero_da_vida: data.numeroDoDestino,
        numerologia_nome: data.numerologiaNome,
      }])
      .select("*");

    console.log("Dados inseridos:", insertedData);
    console.log("Erro ao inserir dados:", error);

    if (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
      return;
    }

    const email = await sendContactEmail(
      ["tudoemental2023@gmail.com", "eduardojerbr@gmail.com"],
      `
    <p>Nome: ${data.name}</p>
    <p>Data de Nascimento: ${data.birthdate}</p>
    <p>Número do Destino: ${data.numeroDoDestino}</p>
    <p>Numerologia do Nome: ${data.numerologiaNome}</p>
    <p>Horário: ${new Date().toLocaleTimeString()}</p>
  `,
    );

    console.log("Email enviado:", email);

    ctx.response.status = 201;
    ctx.response.body = insertedData[0];
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro interno do servidor" };
  }
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
