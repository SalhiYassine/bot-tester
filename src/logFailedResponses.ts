import type { AlgomoResponse } from "./types";

export function logFailedResponses(
  res: {
    id: string;
    data: { messageResponses: AlgomoResponse[] };
  }[]
) {
  const totalMessages = res
    .map((conversation) => conversation.data.messageResponses.length)
    .reduce((acc, curr) => acc + curr, 0);

  const failedMessages = [];
  const noGeneratedQueries = [];
  const apologeticMessages = [];

  for (const conversation of res) {
    for (const messageResponse of conversation.data.messageResponses) {

      if (
        messageResponse.message.includes("FAILED")
      ) {
        failedMessages.push(messageResponse);
        console.error(
          `Failed to get response for message: "${messageResponse.question}" in conversation: "${conversation.id}"`
        );
      }

      if (messageResponse.metadata.generatedQueries.length === 0) {
        noGeneratedQueries.push(messageResponse);
        console.warn(
          `No generated queries for message: "${messageResponse.question}" in conversation: "${conversation.id}"`
        );
      }

      if (
        messageResponse.message.includes("apologize") ||
        messageResponse.message.includes("Sorry") ||
      ) {
        apologeticMessages.push(messageResponse);
        console.error(
          `Apologetic reply for message: "${messageResponse.question}" in conversation: "${conversation.id}"`
        );
      }
    }
  }

  console.log(
    `Total messages: ${totalMessages}, Failed messages: ${failedMessages.length}, Messages with no generated queries: ${noGeneratedQueries.length}, Apologetic messages: ${apologeticMessages.length}`
  );

  console.log(`Error rate: ${failedMessages.length / totalMessages}`);
}
