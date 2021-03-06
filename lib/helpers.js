const collection = require('./collection');
const { updateOne, insert } = require('./mongo');

async function updateSid(doc, sid) {
    return await updateOne(collection, { _id: doc._id }, { $set: { sid }});
}

async function createSession(doc) {
    return await insert(collection, doc);
}

async function addItem(doc, item) {
    return await updateOne(collection, { _id: doc._id }, { $push: { items: item }});
}

async function close(doc) {
    return await updateOne(collection, { _id: doc._id }, { $set: { is_closed: true }});
}

module.exports = {
    updateSid,
    createSession,
    addItem,
    close
};
