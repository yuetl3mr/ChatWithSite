const { ChatOpenAI } = require("@langchain/openai");
const { config } = require('dotenv');
const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");


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
    },
});

const loader = new CheerioWebBaseLoader(
    "https://docs.smith.langchain.com/user_guide"
);

const index = async () => {
    try {
        const docs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 20,
        });


        const allSplits = await textSplitter.splitDocuments(docs);

        const embeddings = new OpenAIEmbeddings({
            apiKey: "sk-dfFlNOrO51QLzF8JI8gpi8IXEqW7krJ71dglXauGvX2QT4Dp",
            configuration: {
                baseURL: "https://open.keyai.shop/v1/",
            }
        },
        );
        const vectorStore = await MemoryVectorStore.fromDocuments(
            allSplits,
            embeddings
        );

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
            answer: documentChain,
        });

        const result = await retrievalChain.invoke({
            messages: [new HumanMessage("Can LangSmith help test my LLM applications?")],
        });

        console.log(result.answer);
    } catch (error) {
        console.log(error);
    }
};

index();
