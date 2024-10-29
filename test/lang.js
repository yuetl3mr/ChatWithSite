const { ChatOpenAI } = require("@langchain/openai");
const { config } = require('dotenv');
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");


config();

const SYSTEM_TEMPLATE = `Answer the user's questions based on the below context. 
If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

<context>
{context}
</context>
`;

const model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_ENDPOINT_URL,
    }
});

const loader = new CheerioWebBaseLoader(
    "https://docs.smith.langchain.com/user_guide"
);

const index = async () => {
    try {
        const docs = await loader.load();
        const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
            ["system", SYSTEM_TEMPLATE],
            new MessagesPlaceholder("messages"),
        ]);
        const documentChain = await createStuffDocumentsChain({
            llm: model,
            prompt: questionAnsweringPrompt,
        });
        const out = await documentChain.invoke({
            messages: [new HumanMessage("Can LangSmith help test my LLM applications?")],
            context: docs,
        });
        console.log(out);
    } catch (error) {
    }
};

index();
