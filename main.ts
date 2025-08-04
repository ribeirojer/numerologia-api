import { Application, Router } from "jsr:@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import {
  deleteDashboardData,
  getDashboardData,
  saveNumerologiaData,
} from "./src/controllers.ts";

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Bem-vindo à API de Numerologia!";
});
router.post("/api/save", saveNumerologiaData);
router.get("/api/dashboard", getDashboardData);
router.delete("/api/dashboard/:id", deleteDashboardData);

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
