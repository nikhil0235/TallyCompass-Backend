const OpenAI = require('openai');
const axios = require("axios");
const fs = require('fs');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY, // Using OpenRouter key based on existing file configuration
    baseURL: "https://openrouter.ai/api/v1"
});

/**
 * Generate embedding for a given text using text-embedding-3-small
 * @param {string} text 
 * @returns {Promise<number[]>}
 */
const generateEmbedding = async (text) => {
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
        // console.log(res.data.data[0].embedding);
        return res.data.data[0].embedding;
    } catch (error) {
        console.error("Error fetching embeddings from OpenRouter:", error.response?.data || error.message);

        // Fallback to direct OpenAI call
        if (process.env.OPENAI_API_KEY) {
            console.log("Falling back to direct OpenAI API for embeddings...");
            const directOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            try {
                const response = await directOpenAI.embeddings.create({
                    model: "text-embedding-3-large",
                    input: text,
                });
                return response.data[0].embedding;
            } catch (fallbackError) {
                console.error("Fallback OpenAI Embedding failed:", fallbackError);
            }
        }

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
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o", // Use a predictable model
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userQuery }
                ],
                max_tokens: 1000 // Increased tokens for summaries
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
        console.error("Error generating completion from OpenRouter:", error.response?.data || error.message);

        // Fallback to direct OpenAI call
        if (process.env.OPENAI_API_KEY) {
            console.log("Falling back to direct OpenAI API for completion...");
            const directOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            try {
                const completion = await directOpenAI.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userQuery }
                    ],
                    max_tokens: 1000
                });
                return completion.choices[0].message.content;
            } catch (fallbackError) {
                console.error("Fallback OpenAI Completion failed:", fallbackError);
                throw fallbackError;
            }
        }

        throw error;
    }
};

/**
 * Transcribe audio file using OpenAI Whisper
 * @param {string} filePath 
 * @returns {Promise<string>}
 */
const transcribeAudio = async (filePath) => {
    try {
        // OpenRouter doesn't always support audio/transcriptions endpoint directly same as OpenAI sdk,
        // but OpenAI SDK can point to OpenRouter base URL. 
        // IF OpenRouter supports whispher, great. If not, we might fail.
        // Assuming we fall back to direct OpenAI calls if needed or OpenRouter supports it.
        // Let's use the OpenAI SDK which is configured above.

        // Use direct OpenAI for Whisper if OpenRouter issues occur, but let's try via configured client.
        // Note: fs.createReadStream is required

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "openai/whisper-1", // OpenRouter model name usually prefixed
        });

        return transcription.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        // Fallback: If OpenRouter fails for audio, try direct OpenAI if key is available
        if (process.env.OPENAI_API_KEY) {
            const directOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            try {
                const transcription = await directOpenAI.audio.transcriptions.create({
                    file: fs.createReadStream(filePath),
                    model: "whisper-1",
                });
                return transcription.text;
            } catch (fallbackError) {
                console.error("Fallback OpenAI Transcription failed:", fallbackError);
                throw fallbackError;
            }
        }
        throw error;
    }
};

/**
 * Generate summary from transcript
 * @param {string} text 
 * @returns {Promise<string>}
 */
const generateSummary = async (text) => {
    const systemPrompt = "You are a helpful assistant that summarizes meeting transcripts. formatted in markdown.";
    const userQuery = `Please summarize the following meeting transcript:\n\n${text}`;
    return await generateCompletion(systemPrompt, userQuery);
};

module.exports = {
    generateEmbedding,
    generateCompletion,
    transcribeAudio,
    generateSummary
};
