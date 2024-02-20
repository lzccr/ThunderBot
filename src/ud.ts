import { InteractionResponseType } from "discord-interactions";
import { Ai } from "@cloudflare/ai";
import { type Env } from ".";

export default async (interaction: any, env: Env, ctx: ExecutionContext) => {
  const applicationId = env.DISCORD_APPLICATION_ID;
  const interactionToken = interaction.token;

  const term = interaction.data.options[0].value;
  const resp = await fetch(
    `https://api.urbandictionary.com/v0/define?term=${term}`
  );
  const data: any = await resp.json();
  const definition1 = data.list[0]?.definition;
  const definition2 = data.list[1]?.definition;
  const respond = async () => {
    const ai = new Ai(env.AI);
    const messages = [
      {
        role: "user",
        content: `Define the word "${term}" in one sentence.

How to define:
- Prefer basing your response on the useful parts of Urban Dictionary.
- If it's inappropriate, don't get offended; combine the useful parts of the UD definition and what you already know to create a helpful definition.

How to respond:
- Don't tell me anything other than the definition; DO NOT say "the definition of [word]" or "[word] is a word that". JUST say the definition.
- Your definition must be safe for teens.

${
  definition1
    ? `Definition from UD: ${definition1}`
    : `If you're not sure, just say "This isn't a word I know."`
}
${definition2 ? `Definition #2 from UD: ${definition2}` : ""}`.trim(),
      },
    ];
    const { response: content } = await ai.run(
      "@cf/mistral/mistral-7b-instruct-v0.1",
      {
        messages,
      }
    );
    await fetch(
      `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`,
      {
        method: "POST",
        body: JSON.stringify({
          content:
            `Definition of ${term}: ${content}` +
            (!definition1 ? "\n(Original content)" : ""),
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
  };
  ctx.waitUntil(respond());
  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
};
