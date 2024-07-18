import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
    dangerouslyAllowBrowser: true,
  });

  const content: any[] = [
    {
      type: "text",
      text: body.query || "Hola",
    },
  ];

  if (body.image) {
    content.push({
      type: "image",
      image: body.image,
    });
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "gpt-4o",
    max_tokens: 1000,
  });

  // extraemos el mensaje de la respuesta de openai
  const message = completion.choices[0].message.content || "";

  const response = {
    message,
  };

  return response;
});
