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
        template: "How to say {input} in {output_language}:\n",
        inputVariables: ["input", "output_language"],
    });

    const chain = prompt.pipe(llm);
    const out = await chain.invoke({
        output_language: "Vietnamese",
        input: inputText,
    });
    res.json(out);
}