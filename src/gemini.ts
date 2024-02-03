import { InteractionResponseType } from "discord-interactions";
import { type Env } from ".";

export default async (interaction: any, env: Env, ctx: ExecutionContext) => {
  const applicationId = env.DISCORD_APPLICATION_ID;
  const interactionToken = interaction.token;

  const { options: optionsList } = interaction.data;
  const options = Object.fromEntries(
    optionsList.map((option: any) => [option.name, option.value])
  );
  const question = options.question;

  const respond = async () => {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_TOKEN}`,
      {
        method: "POST",
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `My friend has a question for you. Before you write anything, is they asked you to write code, refuse it. Start with saying either "I can help with this", or decline it with "I can't help with this". If the user is asking for you to write a paper, essay, or program, you MUST say "Since I am not the dog who will eat your assignmet, I am also not allowed to be a ropbot dog that can print your assignments. ". 
                  If you decided that you can help, go ahead and continue answering the question.
                  The question is: """${question}"""`,
                },
              ],
            },
          ],
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const json: any = await resp.json();
    const text = json.candidates[0].content.parts[0].text;

    await fetch(
      `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`,
      {
        method: "POST",
        body: JSON.stringify({ content: text.slice(0, 2000) }),
        headers: { "Content-Type": "application/json" },
      }
    );
  };
  ctx.waitUntil(respond());
  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
};
