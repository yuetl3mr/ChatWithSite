const { ChatOpenAI } = require("@langchain/openai");
const { config } = require('dotenv');
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage } = require("@langchain/core/messages");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");

config();

const SYSTEM_TEMPLATE = `Answer user questions or summarize context if required based on the below context. 
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
    },
});

module.exports.index = async (req, res) => {
    try {
        const { input, urls } = req.body; // Destructure input and urls from request body
        console.log(input);
        console.log(urls);
        // Validate the urls input
        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: 'Invalid or empty URLs array.' });
        }

        const allDocs = [];

        // Load documents from each URL
        for (const url of urls) {
            const loader = new CheerioWebBaseLoader(url);
            const docs = await loader.load();
            allDocs.push(...docs); // Combine loaded documents
        }

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 20,
        });

        const allSplits = await textSplitter.splitDocuments(allDocs);

        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            configuration: {
                baseURL: process.env.OPENAI_ENDPOINT_URL,
            },
        });
        const vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings);

        const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
            ["system", SYSTEM_TEMPLATE],
            new MessagesPlaceholder("messages"),
        ]);
        const documentChain = await createStuffDocumentsChain({
            llm: model,
            prompt: questionAnsweringPrompt,
        });

        const retriever = vectorStore.asRetriever();

        const parseRetrieverInput = (params) => {
            return params.messages[params.messages.length - 1].content;
        };

        const retrievalChain = RunnablePassthrough.assign({
            context: RunnableSequence.from([parseRetrieverInput, retriever]),
        }).assign({
            content: documentChain,
        });

        const result = await retrievalChain.invoke({
            messages: [new HumanMessage(input)],
        });
        res.json(result);
        console.log(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};
