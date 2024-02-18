import { InteractionResponseType } from "discord-interactions";
import { type Env } from ".";

export default async (interaction: any, env: Env, ctx: ExecutionContext) => {
  const term = interaction.data.options[0].value;
  const response = await fetch(
    `https://api.urbandictionary.com/v0/define?term=${term}`
  );
  const data: any = await response.json();
  const definition = data.list[0].definition;

  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Definition of ${term}: ${definition}`,
    },
  });
};
