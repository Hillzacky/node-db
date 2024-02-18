const NodeDB = require('../src/index.js');

const db = new NodeDB('test/db-test.json');
if (!db.exists()) db.create('db-test', 'Just for test');
db.insert(["brad", "coffee", "water"]);
