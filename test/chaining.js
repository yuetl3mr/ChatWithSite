const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { config } = require('dotenv');

config();

const llm = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_ENDPOINT_URL,
    }
});


const index = async () => {
    const prompt = new PromptTemplate({
        template: "Answer the question : {input}\n",
        inputVariables: ["input"],
    });

    const chain = prompt.pipe(llm);
    const out = await chain.invoke({
        input: "What is manga",
    });
    console.log(out.content);
}

index();