const { ChatOpenAI  } = require ("@langchain/openai");
const { config } = require('dotenv');

config();

const llm = new ChatOpenAI ({
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_ENDPOINT_URL,
  }
});

const run = async () => {
    const aiMsg = await llm.invoke([
        {
            role: "system",
            content:
                "You are a helpful assistant that translates English to Vietnamese. Translate the user sentence.",
        },
        {
            role: "user",
            content: "I love programming.",
        },
    ]);
    console.log(aiMsg.content);
}

run();

