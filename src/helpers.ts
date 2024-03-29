import axios from "axios";
import { responseApiURL, chatbotId, TOKEN } from ".";
import { type AlgomoResponse } from "./types";

import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 1000,
});

async function getResponse(question: string, conversationId: string) {
  const response = await limiter.schedule(async () => {
    console.log("Sending question to chatbot: ", question);
    const res = await axios
      .post(
        responseApiURL,
        {
          messageText: question,
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
        return {
          data: {
            question: question,
            message: `FAILED TO RESPOND: ${err?.message} ${err?.response?.data?.message}`,
            metadata: {
              conversationId: conversationId,
              generatedQueries: [],
              responseContext: [],
            },
          },
        };
      });

    return res;
  });

  const { data } = response;

  const formattedData: AlgomoResponse = {
    message: data.message,
    question: question,
    metadata: {
      conversationId: conversationId,
      generatedQueries: data.metadata.generatedQueries,
      responseContext: data.metadata.responseContext,
    },
  };

  return formattedData;
}

async function converseWithChatbot(
  conversationId: string,
  messages: string[]
): Promise<{
  messageResponses: AlgomoResponse[];
}> {
  const responses = [];

  for (const message of messages) {
    const data = await getResponse(message, conversationId);
    responses.push(data);
  }

  return { messageResponses: responses };
}

/**
 *
 * - This type is used to define the conversation to test
 * - If conversations only need to test a single message then it can be a string
 * - If conversations need to test multiple messages then it can be an object with an id and an array of messages
 * - The id is used to identify the conversation in the output, it is optional
 */
export type Conversation =
  | {
      id?: string;
      messages: string[];
    }
  | string;
export async function testChatbot({
  data,
}: {
  data: {
    conversations: Conversation[];
  };
}): Promise<
  {
    id: string;
    data: { messageResponses: AlgomoResponse[] };
  }[]
> {
  return await Promise.all(
    data.conversations.map(async (conversation) => {
      if (typeof conversation === "string") {
        const id = Math.random().toString(36).substring(7);
        return {
          id,
          data: await converseWithChatbot(id, [conversation]),
        };
      }

      const id = conversation?.id || Math.random().toString(36).substring(7);

      return {
        id,
        data: await converseWithChatbot(id, conversation.messages),
      };
    })
  );
}
