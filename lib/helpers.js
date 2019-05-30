const collection = require('./collection');
const { updateOne } = require('./mongo');

async function updateSid(doc, sid) {
    return await updateOne(collection, { _id: doc._id }, { '$set': { sid }});
}

async function createSession(doc) {

}

module.exports = {
    updateSid,
    createSession
};
