import { chatbotId } from ".";

export function saveOutput(
  res: {
    id: string;
    data: { messageResponses: { message: string; response: string }[] };
  }[]
) {
  const fs = require("fs");
  // in the chatbotId folder a file with  -> mm:hh-dd/mm.json
  const date = new Date();
  const formattedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
  const fileName = `${formattedTime}-${formattedDate}.json`;
  const folderPath = `./outputs/${chatbotId}`;

  if (!fs.existsSync("./outputs")) {
    fs.mkdirSync("./outputs");
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  fs.writeFileSync(`${folderPath}/${fileName}`, JSON.stringify(res, null, 2));
}
