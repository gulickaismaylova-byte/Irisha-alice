const express = require("express");
const app = express(); app.use(express.json());
app.get("/", (req, res) => { res.send("Иришка работает!"); });
app.post("/", async (req, res) => { const body = req.body; const userText = body.request?.original_utterance  body.request?.command  "";
const session = body.session  {}; const version = body.version  "1.0";
function aliceResponse(text) { return { version, session, response: { text: text.slice(0, 1000), end_session: false } }; }
if (!userText.trim()) { return res.json( aliceResponse("Привет! Я Иришка. Задавай мне любой вопрос!") ); }
try { const response = await fetch( "https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", Authorization: Bearer ${process.env.OPENAI_API_KEY} }, body: JSON.stringify({ model: "gpt-5-mini", instructions: "Ты Иришка, дружелюбный голосовой помощник. Отвечай на русском языке, естественно, понятно и кратко. Не используй Markdown.", input: userText, max_output_tokens: 500 }) } );
if (!response.ok) {
  const error = await response.text();
  console.error("OpenAI error:", error);

  return res.json(
    aliceResponse("Не получилось получить ответ. Попробуй позже.")
  );
}

const data = await response.json();

let answer = data.output_text;

if (!answer && data.output) {
  answer = data.output
    .flatMap(item => item.content || [])
    .filter(item => item.type === "output_text")
    .map(item => item.text)
    .join("");
}

res.json(
  aliceResponse(answer || "Я не смогла сформировать ответ.")
);} catch (error) { console.error(error);
res.json(
  aliceResponse("Произошла ошибка. Попробуй ещё раз.")
);} });
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => { console.log(Иришка запущена на порту ${PORT}); });
