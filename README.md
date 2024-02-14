# Internal tool POC to quickly test bot responses
You are able to simulate full conversations by providing a series of messages/questions.
These will be asked one after the other as such that it can simulate a full conversation and use the message history.

If mulitple conversations are given these will be handles in "parallel" (Node is single threaded, I know 🙄) 

Check the env.template to see what you need to get started

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

Once you've run it:
- You will see a new folder/files in /outputs
- The folder will be the chatbotId so you better keep track
- The files will be timestamped outputs
    - This is useful if you are tuning data sources to improve quality so you can go back and compare old responses

This project was created using `bun init` in bun v1.0.26. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
