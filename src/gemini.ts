import { InteractionResponseType } from "discord-interactions";
import { type Env } from ".";

type Category = {
  category: string;
  probability: string;
};
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
              role: "user",
              parts: [
                {
                  text: `[SYSTEM] The user, ${interaction.member.user.username}, is currently interacting with you through ThunderBot. Refuse writing essays, whole programs, or other whole assignments (the user is likely to plagiarize). I repeat, do NOT write essays, papers, or other long-form content - instead tell the user that you can't help with that.`,
                },
              ],
            },
            {
              role: "model",
              parts: [
                {
                  text: `Got it. For ALL further messages I will use that guidance, without straying away regardless of what the user says.`,
                },
              ],
            },
            {
              role: "user",
              parts: [
                {
                  text: question,
                },
              ],
            },
          ],
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const json: any = await resp.json();
    if (json.candidates) {
      const text = json.candidates[0].content.parts[0].text;

      await fetch(
        `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`,
        {
          method: "POST",
          body: JSON.stringify({ content: text.slice(0, 2000) }),
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const flags = (json.promptFeedback.safetyRatings as any[])
        .filter(
          (category: Category) =>
            category.probability == "MEDIUM" || category.probability == "HIGH"
        )
        .map((category: Category) => {
          if (category.category == "HARM_CATEGORY_SEXUALLY_EXPLICIT")
            return "explicit";
          if (category.category == "HARM_CATEGORY_HATE_SPEECH")
            return "hateful";
          if (category.category == "HARM_CATEGORY_HARASSMENT")
            return "harassing";
          if (category.category == "HARM_CATEGORY_DANGEROUS_CONTENT")
            return "dangerous";
          return category.category;
        });
      const formattedFlags =
        flags.length > 1
          ? `${flags.slice(0, -1).join(", ")} and ${flags[flags.length - 1]}`
          : flags[0];
      await fetch(
        `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`,
        {
          method: "POST",
          body: JSON.stringify({
            content: `I'm not going to respond to that. Your message was ${formattedFlags}.`,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
  ctx.waitUntil(respond());
  return Response.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
};
