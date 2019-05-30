const collection = require('./collection');
const { updateOne, insert } = require('./mongo');

async function updateSid(doc, sid) {
    return await updateOne(collection, { _id: doc._id }, { '$set': { sid }});
}

async function createSession(doc) {
    return await insert(collection, doc);
}

module.exports = {
    updateSid,
    createSession
};
