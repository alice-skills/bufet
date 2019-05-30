const { connect, } = require('mongodb');

// Промис с БД
let dbPromise = null;
const DEFAULT_OPTIONS = {
    useNewUrlParser: true
};

function getDatabase() {
    if (!dbPromise) {
        let options = DEFAULT_OPTIONS;

        try {
            options = Object.assign({}, DEFAULT_OPTIONS, JSON.parse(process.env.MONGO_OPTIONS));
        } catch(e) {}

        dbPromise = connect(process.env.MONGO_URL, options).then(client => client.db());
    }

    return dbPromise;
}

// Храним в объекте для каких коллекций мы точно проверили индексы
const collectionIndexes = {};

// Массив индексов, которые должны быть созданы у коллекций с ответами
const SESSION_INDEXES = [
];

function getCollection(name, indexes) {
    const promise = getDatabase().then(db => db.collection(name));

    if (collectionIndexes[name]) {
        return promise;
    }

    collectionIndexes[name] = true;

    return promise.then(collection => ensureIndexes(collection, indexes));
}

function ensureIndexes(collection, indexes) {
    // Получаем массив существующих индексов у коллекции
    return collection.indexes()
        .then((existingIndexes) => {
            // Массив недостающих индексов
            const missingIndexes = indexes.filter(
                spec => existingIndexes.findIndex(
                    ({ name: existingIndexName }) => {
                        return spec.name === existingIndexName;
                    }
                ) === -1
            );

            if (missingIndexes.length === 0) {
                return;
            }

            // Создаём недостающие индексы
            return collection.createIndexes(missingIndexes);
        })
        .then(() => collection)
        .catch(e => {
            console.error('Failed to create index');

            // Либо не удалось получить список индексов, либо не удалось создать недостающие
            // Попробуем в следующий раз
            collectionIndexes[collection.collectionName] = false;

            return collection;
        });
}

function insert(collectionName, doc, options) {
    return getCollection(collectionName, SESSION_INDEXES)
        .then(collection => collection.insertOne(doc, options));
}

function findOne(collectionName, filter, options) {
    return getCollection(collectionName, SESSION_INDEXES)
        .then(collection => collection.findOne(filter, options));
}

function find(collectionName, filter, options) {
    return getCollection(collectionName, SESSION_INDEXES)
        .then(collection => collection.find(filter, options).toArray());
}

function updateOne(collectionName, filter, update, options) {
    return getCollection(collectionName, SESSION_INDEXES)
        .then(collection => collection.updateOne(filter, update, options));
}

module.exports = {
    insert,
    findOne,
    find,
    updateOne
};
