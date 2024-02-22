import dotenv from "dotenv";
import { exit } from "process";
import { testChatbot, type Conversation } from "./helpers";
import { saveOutput } from "./saveOutput";
import { logFailedResponses } from "./logFailedResponses";

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
  /**
   * Conversations to test
   *
   * Each conversation is an object with an id and an array of messages
   *
   * The id is used to identify the conversation in the output
   *
   * The messages (if more than one is given for a conversation) are sent in order to the chatbot
   * they will be sent sequentially to mimick a real conversation
   */
  const conversations: Conversation[] = ["How much is it to service my car?"];

  const res = await testChatbot({
    data: {
      conversations,
    },
  });

  saveOutput(res);
  logFailedResponses(res);

  exit(0);
}

run();
