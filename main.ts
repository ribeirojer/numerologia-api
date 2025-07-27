import { Application, Router } from "jsr:@oak/oak";
import { supabase } from "./src/supabase.ts";
import { NumerologiaData } from "./src/types.ts";

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Bem-vindo à API de Numerologia!";
});

router.post("/api/save", async (ctx) => {
  try {
    const data = await ctx.request.body.json() as NumerologiaData;
    
    const requiredFields = ["name", "birthdate", "numeroDaVida", "numerologiaNome"];
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
      numero_da_vida: data.numeroDaVida,
      numerologia_nome: data.numerologiaNome
    }])
    .select("*");

  if (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
    return;
  }

  ctx.response.status = 201;
  ctx.response.body = insertedData[0];
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    ctx.response.status = 400;
    ctx.response.body = { error: "Formato de dados inválido" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });