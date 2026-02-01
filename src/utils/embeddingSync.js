const UnifiedEmbedding = require('../models/UnifiedEmbedding');
const { generateEmbedding } = require('./openai');

/**
 * Format document into a text representation based on its model type
 * @param {Object} doc - The document to format
 * @param {string} modelName - The model name (Customer, Product, etc.)
 * @returns {Promise<{text: string, metadata: Object}>}
 */
const formatDocument = async (doc, modelName) => {
    let text = '';
    let metadata = {};

    try {
        switch (modelName) {
            case 'Customer':
                text = `Customer: ${doc.companyName}. Contact: ${doc.contactPersonName}. Email: ${doc.email}. Phone: ${doc.contactNo}. Proficiency: ${doc.customerProficiency}. Status: ${doc.accountStatus}. Location: ${doc.location?.city}, ${doc.location?.state}, ${doc.location?.country}. Business: ${doc.businessType}. Plan: ${doc.planType}. Features: ${doc.featureList?.join(', ')}.`;
                metadata = {
                    customerId: doc._id,
                    city: doc.location?.city,
                    state: doc.location?.state,
                    country: doc.location?.country,
                    planType: doc.planType,
                    businessType: doc.businessType,
                    status: doc.accountStatus,
                    proficiency: doc.customerProficiency
                };
                break;

            case 'User':
                text = `User: ${doc.fullName} (${doc.userName}). Role: ${doc.function}. Designation: ${doc.designation}. Email: ${doc.email}. Status: ${doc.status}. Location: ${doc.location?.city}, ${doc.location?.state}, ${doc.location?.Country}. Year of Joining: ${doc.yearOfJoining}.`;
                metadata = {
                    userId: doc._id,
                    role: doc.function,
                    email: doc.email,
                    status: doc.status,
                    city: doc.location?.city,
                    state: doc.location?.state,
                    country: doc.location?.Country
                };
                break;

            case 'FormResponse':
                const qaPairs = doc.answers?.map(a => `Q: ${a.question} A: ${Array.isArray(a.answer) ? a.answer.join(', ') : a.answer}`).join('. ');
                text = `Form Response: ${doc.title}. Submitted by: ${doc.email}. Responses: ${qaPairs}`;
                metadata = {
                    formResponseId: doc._id,
                    formId: doc.formId,
                    email: doc.email,
                    title: doc.title
                };
                break;

            case 'Product':
                text = `Product: ${doc.productName}. Version: ${doc.version}.`;
                metadata = {
                    productName: doc.productName,
                    version: doc.version
                };
                break;

            case 'VOC':
                await doc.populate(['customerDetailsObj.customerID', 'ProductID', 'customerDetailsObj.feedbackID', 'customerDetailsObj.customerRequestID']);

                const vocCustomerName = doc.customerDetailsObj?.customerID?.companyName || 'Unknown Customer';
                const vocProductName = doc.ProductID?.productName || 'Unknown Product';

                text = `VOC Project: ${doc.projectName}. Status: ${doc.status}. Description: ${doc.description}. Customer: ${vocCustomerName}. Product: ${vocProductName}.`;
                metadata = {
                    vocId: doc._id,
                    customerId: doc.customerDetailsObj?.customerID?._id,
                    productId: doc.ProductID?._id,
                    status: doc.status
                };
                break;

            case 'CustomerRequest':
                await doc.populate(['customterList', 'productId']);
                const reqCustomerNames = doc.customterList?.map(c => c.companyName).join(', ') || 'Unknown Customer';
                const reqProductName = doc.productId?.productName || 'Unknown Product';

                text = `Request: ${doc.requestTitle}. Type: ${doc.requestType}. Description: ${doc.description}. Status: ${doc.action?.status}. Customers: ${reqCustomerNames}. Product: ${reqProductName}.`;
                metadata = {
                    requestId: doc._id,
                    customerIds: doc.customterList?.map(c => c._id) || [],
                    productId: doc.productId?._id,
                    type: doc.requestType,
                    status: doc.action?.status
                };
                break;

            case 'Feedback':
                await doc.populate('customerId');
                const feedCustomerName = doc.customerId?.companyName || 'Unknown Customer';

                text = `Feedback: ${doc.description}. Rating: ${doc.rating}/5. Medium: ${doc.medium}. Customer: ${feedCustomerName}.`;
                metadata = {
                    feedbackId: doc._id,
                    customerId: doc.customerId?._id,
                    rating: doc.rating,
                    medium: doc.medium
                };
                break;

            default:
                throw new Error(`Unknown model name: ${modelName}`);
        }
    } catch (e) {
        console.error(`Error formatting document for ${modelName}:`, e);
        // Fallback or rethrow? Let's log and rethrow safely
        text = `Error formatting ${modelName} ${doc._id}`;
    }

    return { text, metadata };
};

/**
 * Syncs a document to the UnifiedEmbedding collection
 * @param {Object} doc - The document to sync
 * @param {string} modelName - The source model name
 */
const syncDocument = async (doc, modelName) => {
    try {
        if (!doc) return;

        // If it's a delete operation hook, doc might be the deleted doc
        // But usually for delete we handle separately. This is for save/update.

        const { text, metadata } = await formatDocument(doc, modelName);

        if (!text) return; // Skip if no text generated

        const embedding = await generateEmbedding(text);

        await UnifiedEmbedding.findOneAndUpdate(
            { sourceCollection: modelName, sourceId: doc._id },
            {
                sourceCollection: modelName,
                sourceId: doc._id,
                text,
                embedding,
                metadata
            },
            { upsert: true, new: true }
        );

        console.log(`Synced embedding for ${modelName} ${doc._id}`);
    } catch (error) {
        console.error(`Error syncing embedding for ${modelName} ${doc._id}:`, error);
    }
};

/**
 * Deletes an embedding for a removed document
 * @param {string} docId 
 * @param {string} modelName 
 */
const deleteDocumentEmbedding = async (docId, modelName) => {
    try {
        await UnifiedEmbedding.deleteOne({ sourceCollection: modelName, sourceId: docId });
        console.log(`Deleted embedding for ${modelName} ${docId}`);
    } catch (error) {
        console.error(`Error deleting embedding for ${modelName} ${docId}:`, error);
    }
};

module.exports = {
    syncDocument,
    deleteDocumentEmbedding
};
