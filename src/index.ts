import dotenv from "dotenv";
import { exit } from "process";
import { testChatbot } from "./helpers";
import { saveOutput } from "./saveOutput";

type Vars = {
  BASE_URL: string;
  TOKEN: string;
  CHATBOT_ID: string;
};
const envVariables = dotenv.config().parsed as Vars;

const endpointPath = "/api/v2/external/api-access/get-bot-response";
const baseURL = envVariables.BASE_URL;
export const TOKEN = envVariables.TOKEN;
export const chatbotId = envVariables.CHATBOT_ID;
export const responseApiURL = `${baseURL}${endpointPath}`;

async function run() {
  const conversations = [
    {
      id: Math.random().toString(),
      messages: ["Is Soltour a strategic partner?"],
    },
    {
      id: Math.random().toString(),
      messages: ["Which commission is giving us?"],
    },
    {
      id: Math.random().toString(),
      messages: ["Can you name our strategic partners?"],
    },
    {
      id: Math.random().toString(),
      messages: ["Can you name our strategic partners in Portugal?"],
    },
    {
      id: Math.random().toString(),
      messages: ["Which partners have charter operation to Agadir on Friday?"],
    },
  ];

  const res = await testChatbot(conversations);

  saveOutput(res);
  exit(0);
}

run();
