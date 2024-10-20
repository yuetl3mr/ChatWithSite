const { config } = require('dotenv');
const { ChatOpenAI } = require('@langchain/openai');


config();

const llm = new ChatOpenAI();

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