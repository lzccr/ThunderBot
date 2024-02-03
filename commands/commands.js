export const USER_COMMAND = {
  name: "user",
  description: "Provides information about the user.",
  options: [],
};

export const RICKROLL_COMMAND = {
  name: "bestsong",
  description: "Sends you the lyrics of the best song ever!",
  options: [],
};

export const SUS_COMMAND = {
  name: "sus",
  description:
    "Visit a lab to test if you are sus using the latest technology.",
  options: [],
};

export const MODSTORY_COMMAND = {
  name: "modstory",
  description: "Stop your stereotyping of discord mods.",
  options: [],
};

export const GEMINI_COMMAND = {
  name: "gemini",
  description: "Ask Gemini!",
  options: [
    {
      type: 3, // STRING
      name: "question",
      description: "What to ask Gemini",
      required: true,
    },
  ],
};
