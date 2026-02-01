const UnifiedEmbedding = require('../models/UnifiedEmbedding');
const { generateEmbedding, generateCompletion } = require('../utils/openai');

/**
 * Handle natural language query
 * @param {Object} req 
 * @param {Object} res 
 */
const search = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query string is required' });
        }

        // 1. Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);
        console.log(queryEmbedding);

        // 2. Perform vector search
        // Note: 'vectorSearch' requires an Atlas Vector Search Index named 'vector_index' (default) or specified.
        // The index MUST be defined on the 'embedding' field.
        const results = await UnifiedEmbedding.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", // Ensure this index is created in Atlas on 'embedding'
                    "path": "embedding",
                    "queryVector": queryEmbedding,
                    "numCandidates": 100,
                    "limit": 20
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "text": 1,
                    "sourceCollection": 1,
                    "sourceId": 1,
                    // "score": { "$meta": "vectorSearchScore" } // Optional: include score
                }
            }
        ]);

        if (results.length === 0) {
            return res.json({ answer: "I couldn't find any relevant information to answer your query.", context: [] });
        }

        // 3. Construct context
        const context = results.map(r => `[Source: ${r.sourceCollection} | ID: ${r.sourceId}] ${r.text}`).join('\n---\n');

        // 4. Generate Answer
        const systemPrompt = `You are a helpful assistant for the 'Voice of Customer' platform.
        Use the following pieces of context to answer the user's question.
        Each piece of context starts with [Source: COLLECTION | ID: IDENTIFIER].
        When answering, you can reference the source type and ID if relevant.
        Context:
        ${context}
        `;

        const answer = await generateCompletion(systemPrompt, query);

        res.json({
            answer,
            sources: results.map(r => ({
                collection: r.sourceCollection,
                id: r.sourceId,
                content: r.text
            }))
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    search
};
