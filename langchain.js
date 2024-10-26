const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { config } = require('dotenv');

config();

// initial 
const llm = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_ENDPOINT_URL,
  }
});

// chaining 

const run = async () => {
  const prompt = new PromptTemplate({
    template: "How to say {input} in {output_language}:\n",
    inputVariables: ["input", "output_language"],
  });

  const chain = prompt.pipe(llm);
  const res = await chain.invoke({
    output_language: "Vietnamese",
    input: "I love programming.",
  });
  console.log(res.content);
}

run();

