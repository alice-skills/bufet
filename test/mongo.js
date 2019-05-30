const { insert, updateOne, findOne } = require('../lib/mongo');

const collectionName = '__test__';

async function test() {
    try {
        const res1 = await insert(collectionName, { foo: 'bar' });

        if (res1.insertedCount !== 1) {
            throw new Error(`res1.insertedCount !== 1`);
        }

        const doc2 = await findOne(collectionName, { _id: res1.insertedId });

        if (doc2.foo !== 'bar') {
            throw new Error(`doc2.foo !== 'bar'`);
        }

        const res2 = await updateOne(collectionName, { _id: res1.insertedId }, { '$set': { foo: 'baz' } });

        if (res2.modifiedCount !== 1) {
            throw new Error(`res2.modifiedCount !== 1`);
        }

        const doc3 = await findOne(collectionName, { _id: res1.insertedId });

        if (doc3.foo !== 'baz') {
            throw new Error(`doc3.foo !== 'baz'`);
        }

        console.info('OK');
        process.exit(0);
    } catch(e) {
        console.error('Oops', e);
        process.exit(1);
    }
}

test();
