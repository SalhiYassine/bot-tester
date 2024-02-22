import { chatbotId } from ".";
import type { AlgomoResponse } from "./types";

export function saveOutput(
  res: {
    id: string;
    data: { messageResponses: AlgomoResponse[] };
  }[],
) {
  const fs = require("fs");
  // in the chatbotId folder a file with  -> mm:hh-dd/mm.json
  const date = new Date();
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
  const fileName = `${formattedDate}-${formattedTime}`;
  const folderPath = `./outputs/${chatbotId}`;

  if (!fs.existsSync("./outputs")) {
    fs.mkdirSync("./outputs");
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  fs.writeFileSync(
    `${folderPath}/${fileName}.json`,
    JSON.stringify(res, null, 2),
  );
  const questionAnswerPairs = res.map((conversation) => {
    return {
      question: conversation.data.messageResponses[0].question,
      answer: conversation.data.messageResponses[0].message,
    };
  });

  const mdFile = `# ${chatbotId} - ${formattedDate} - ${formattedTime}\n\n${questionAnswerPairs
    .map((pair) => {
      return `## ${pair.question}\n\n${pair.answer}\n\n`;
    })
    .join("\n")}`;

  fs.writeFileSync(`${folderPath}/${fileName}.md`, mdFile);
}
