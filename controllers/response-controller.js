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

module.exports.index = async (req, res) => {
    const inputText = req.body.input;
    console.log(inputText);
    const prompt = new PromptTemplate({
        template: "Suggest ways to complete {input} tasks effectively? Reply in short.\n",
        inputVariables: ["input"],
    });

    const chain = prompt.pipe(llm);
    const out = await chain.invoke({
        input: inputText,
    });
    res.json(out);
}