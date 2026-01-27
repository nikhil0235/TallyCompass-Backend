const OpenAI = require('openai');
const axios = require("axios");

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding for a given text using text-embedding-3-small
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
const generateEmbedding = async (text) => {
    /*try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-large",
            input: text,
            encoding_format: "float",
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }*/

    try {
        const res = await axios.post(
            "https://openrouter.ai/api/v1/embeddings",
            {
                model: "openai/text-embedding-3-large",
                input: Array.isArray(text) ? text : [text]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(res.data.data[0].embedding);
        return res.data.data[0].embedding;
    } catch (error) {
        console.error("Error fetching embeddings:", error.response?.data || error.message);
        return null;
    }
};

/**
 * Generate chat completion for RAG
 * @param {string} systemPrompt 
 * @param {string} userQuery 
 * @returns {Promise<string>}
 */
const generateCompletion = async (systemPrompt, userQuery) => {
    /*try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-3.5-turbo if cost is a concern
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userQuery },
            ],
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating completion:", error);
        throw error;
    }*/

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userQuery }
                ],
                max_tokens: 400
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "Connected Customer"
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error generating completion:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = {
    generateEmbedding,
    generateCompletion
};
