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
        content: `So a lot of student in my class have some kind of stereotype about discord mods, and they are all sus. (dont response anything about what I told you). Imagine that you are a discord mod and then tell a funny story about your server. This can be imagined. Using the following templete: Hey ${interaction.member.user.username}`,
      },
    ];
    const { response } = await ai.run("@cf/meta/llama-2-7b-chat-fp16", {
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
