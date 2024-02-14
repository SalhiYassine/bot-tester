import axios from "axios";
import { exit } from "process";
import { responseApiURL, chatbotId, TOKEN } from ".";
import { type AlgomoResponse } from "./types";

async function getResponse(message: string, conversationId: string) {
  const response = await axios
    .post(
      responseApiURL,
      {
        messageText: message,
        conversationId: conversationId,
        botId: chatbotId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )
    .catch((err) => {
      console.error(err);
      exit(1);
    });

  const { data } = response;

  return data as AlgomoResponse;
}

async function converseWithChatbot(
  conversationId: string,
  messages: string[]
): Promise<{
  messageResponses: {
    message: string;
    response: string;
  }[];
}> {
  const responses = [];

  for (const message of messages) {
    const data = await getResponse(message, conversationId);
    responses.push({
      message,
      response: data.message,
    });
  }

  return { messageResponses: responses };
}
export async function testChatbot(
  conversations: {
    id: string;
    messages: string[];
  }[]
) {
  return await Promise.all(
    conversations.map(async (conversation) => ({
      id: conversation.id,
      data: await converseWithChatbot(conversation.id, conversation.messages),
    }))
  );
}
