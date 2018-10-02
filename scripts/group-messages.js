const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const mkdirpSync = require('mkdirp').sync;

const MESSAGES_PATTERN = path.resolve(
  __dirname + '/../src/i18n/translations/**.json'
);
const OUTPUT_DIR = path.resolve(__dirname + '/../src/i18n/build/');

const checkMissingMessageIds = namespacedMessages => {
  // We use nb translations as master / source of truth
  const nbJSON = 'nb.json';
  const masterKeys = Object.keys(namespacedMessages[nbJSON]).sort();

  Object.keys(namespacedMessages).forEach(key => {
    if (key !== nbJSON) {
      const sortedKeys = Object.keys(namespacedMessages[key]).sort();
      const difference = masterKeys.filter(x => !sortedKeys.includes(x));
      if (difference.length) {
        console.log(`${key} does not include following keys:`, difference);
      }
    }
  });
};

const getMessagesOfObject = (object, parentNamespace) => {
  const collection = {};

  Object.entries(object).forEach(property => {
    const name = property[0];
    const value = property[1];
    const id = parentNamespace + name;
    if((typeof value === 'object') && (value !== null)) {
      Object.assign(
        collection,
        getMessagesOfObject(value, id + '.')
      );
    } else {
      collection[id] = value;
    }
  });

  return collection;
};

const messages = globSync(MESSAGES_PATTERN)
  .map(filename => ({
    filename: filename.split('/').pop(),
    file: JSON.parse(fs.readFileSync(filename, 'utf8'))
  }))
  .reduce((collections, { filename, file }) => {
    collections[filename] = Object.assign(
      {},
      collections[filename],
      getMessagesOfObject(file, '')
    );

    return collections;
  }, {});

console.log('Writing translation strings...');

Object.keys(messages).forEach(filename => {
  const collection = messages[filename];
  const target = path.join(OUTPUT_DIR, filename);
  mkdirpSync(OUTPUT_DIR);
  fs.writeFileSync(target, JSON.stringify(collection, null, 2));
});

checkMissingMessageIds(messages);
