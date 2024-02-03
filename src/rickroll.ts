import{
    InteractionResponseType, 
} from "discord-interactions";
import { type Env } from ".";

export default async (interaction: any, env: Env, ctx: ExecutionContext) => {
    return Response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
            `Never gonna give you up! Never gonna let you down! Never gonna run around and desert you! Never gonna make you cry! Never gonna say goodbye. Never gonna tell a lie and hurt you.`
      },
    });
  }