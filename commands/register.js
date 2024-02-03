import {
  USER_COMMAND,
  RICKROLL_COMMAND,
  SUS_COMMAND,
  MODSTORY_COMMAND,
  GEMINI_COMMAND,
} from "./commands.js";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
dotenv.config({ path: path.join(dirname, "..", ".env") });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token || !applicationId) {
  throw new Error("Environment variables are not present");
}

const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
// const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/1181473020259356702/commands`;

const response = await fetch(url, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bot ${token}`,
  },
  method: "PUT",
  body: JSON.stringify([
    USER_COMMAND,
    RICKROLL_COMMAND,
    SUS_COMMAND,
    MODSTORY_COMMAND,
    GEMINI_COMMAND,
  ]),
});

if (response.ok) {
  console.log("Registered all commands");
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
} else {
  console.error("Error registering commands");
  let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
  try {
    const error = await response.text();
    if (error) {
      errorText = `${errorText} \n\n ${error}`;
    }
  } catch (err) {
    console.error("Error reading body from request:", err);
  }
  console.error(errorText);
}
