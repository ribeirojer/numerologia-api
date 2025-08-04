import { NumerologiaData } from "./types.ts";
import { supabase } from "./supabase.ts";
import { RouterContext } from "jsr:@oak/oak";

export const saveNumerologiaData = async (
  // deno-lint-ignore ban-types
  ctx: RouterContext<string, Record<string, string>, {}>,
) => {
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

    ctx.response.status = 201;
    ctx.response.body = insertedData[0];
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro interno do servidor" };
  }
};

export const getDashboardData = async (
  // deno-lint-ignore ban-types
  ctx: RouterContext<string, Record<string, string>, {}>,
) => {
  try {
    const queryParams = ctx.request.url.searchParams;
    const page = parseInt(queryParams.get("page") || "1", 10);
    const limit = parseInt(queryParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Parâmetros inválidos" };
      return;
    }

    const { data, error, count } = await supabase
      .from("tabela_numerologia")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
      return;
    }

    console.log("Dados do dashboard:", data);
    console.log("Erro ao obter dados do dashboard:", error);

    ctx.response.status = 200;
    ctx.response.body = {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error("Erro ao obter dados do dashboard:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro interno do servidor" };
  }
};

export const deleteDashboardData = async (
  // deno-lint-ignore ban-types
  ctx: RouterContext<string, Record<string, string>, {}>,
) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "ID é obrigatório" };
      return;
    }

    const { data, error } = await supabase
      .from("tabela_numerologia")
      .delete()
      .eq("id", id)
      .select("*");

    if (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
      return;
    }

    if (data.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Registro não encontrado" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Registro deletado com sucesso",
      data: data[0],
    };
  } catch (error) {
    console.error("Erro ao deletar dados do dashboard:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro interno do servidor" };
  }
};
