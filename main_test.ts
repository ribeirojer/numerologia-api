import { assertEquals } from "@std/assert";

/*Deno.test(async function addTest() {
  const send = {
    name: "Test",
    birthdate: "2000-01-01",
    numeroDoDestino: 1,
    numerologiaNome: "Test",
  };

  //const response = await fetch("https://numerologia-79.deno.dev/api/save", {
     const response = await fetch("http://localhost:8000/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(send),
  });

  const data = await response.json();
  assertEquals(response.status, 201);
  assertEquals(data.nome, "Test");
  assertEquals(data.data_nascimento, "2000-01-01");
  assertEquals(data.numero_da_vida, 1);
  assertEquals(data.numerologia_nome, "Test");
});*/

Deno.test(async function dashboardTest() {
  //const response = await fetch("https://numerologia-79.deno.dev/api/dashboard", {
  const response = await fetch(
    "http://localhost:8000/api/dashboard?page=2&limit=10",
  );

  const data = await response.json();
  assertEquals(response.status, 200);

  assertEquals(Array.isArray(data.data), true);
});
