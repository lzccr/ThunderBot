import{
    InteractionResponseType, 
} from "discord-interactions";
import { type Env } from ".";

export default async (interaction: any, env: Env, ctx: ExecutionContext) => {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
            `Hello ${interaction.member.user.username}, I'm Thunder! Feel free to chat with me! `
      },
    });
  }