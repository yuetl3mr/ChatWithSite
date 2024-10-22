const { config } = require('dotenv');
const OpenAI = require("openai");
config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  
    baseURL: process.env.OPENAI_ENDPOINT_URL,  
});

const run = async () => {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",  
        messages: [
            { role: "system", content: "You are a helpful assistant that only answer question about weather, otherwise, politely decline to answer" },
            {
                role: "user",
                content: "how to cook beef",
            },
        ],
    });
    console.log(completion.choices[0].message.content);
};

run();
