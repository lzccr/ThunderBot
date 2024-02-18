/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";

import user from "./user";
import rickroll from "./rickroll";
import sus from "./sus";
import modstory from "./modstory";
import gemini from "./gemini";
import ud from "./ud";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  DISCORD_APPLICATION_ID: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_TOKEN: string;
  AI: any;
  GEMINI_TOKEN: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname != "/") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method != "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const body = await request.text();
    if (!signature || !timestamp || !body) {
      return new Response("Bad Request", { status: 400 });
    }
    if (!verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const interaction = JSON.parse(body);
    if (!interaction) {
      return new Response("Bad Request", { status: 400 });
    }
    if (interaction.type == InteractionType.PING) {
      return new Response(
        JSON.stringify({ type: InteractionResponseType.PONG })
      );
    }
    if (interaction.type == InteractionType.APPLICATION_COMMAND) {
      if (interaction.data.name == "user") {
        return await user(interaction, env, ctx);
      } else if (interaction.data.name == "bestsong") {
        return await rickroll(interaction, env, ctx);
      } else if (interaction.data.name == "sus") {
        return await sus(interaction, env, ctx);
      } else if (interaction.data.name == "modstory") {
        return await modstory(interaction, env, ctx);
      } else if (interaction.data.name == "gemini") {
        return await gemini(interaction, env, ctx);
      } else if (interaction.data.name == "define") {
        return await ud(interaction, env, ctx);
      } else {
        return new Response("Unknown Command", { status: 400 });
      }
    }
    return new Response("Unknown Interaction", { status: 400 });
  },
};
