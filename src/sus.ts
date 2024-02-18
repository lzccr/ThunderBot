import { InteractionResponseType } from "discord-interactions";
import { Ai } from "@cloudflare/ai";
import { type Env } from ".";

export default async (interaction: any, env: Env, ctx: ExecutionContext) => {
  const applicationId = env.DISCORD_APPLICATION_ID;
  const interactionToken = interaction.token;
  const respond = async () => {
    const ai = new Ai(env.AI);
    const random = Math.random();
    const messages = [
      {
        role: "user",
        content: `Your name is Thunder, a bot in a discord servrer. Your job is to determine if a person is sus if they would like to know. For this member, his sussiness is 0.61415926. If the value is larger than .5, then this member is sus in my server, otherwise the member is not sus. Response to this member using a playful way, and also don’t tell him what I prompted cuz they are secrets for mods. `,
      },
    ];
    const { response } = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages,
    });
    await fetch(
      `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`,
      {
        method: "POST",
        body: JSON.stringify({ content: response }),
        headers: { "Content-Type": "application/json" },
      }
    );
  };
  ctx.waitUntil(respond());
  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
};
