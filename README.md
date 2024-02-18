# Node-db
Node-db is Library for using local database with json for nodejs.

## Usage

```js
const NodeDB = require('@hillzacky/node-db');

const db = new NodeDB('example.json');

// Initialize a new database
// db.create(name, description)
db.create('example database', 'This is an example created database');

// Append data to the database
// db.insert(data, id=NaN)
db.insert(["A", "B", "C"])
// If you want to specify an id, you can do so
db.insert(["A", "B", "C"], 1)
// If the id already exists, node-db will throw a warning and set a id that doesn't exist

// Write to a specific id
// db.update(id, data)
db.update(1, ["A", "B", "C"])

// Read from a specific id
// db.read(id)
db.select(1)

// Delete a specific id
// db.delete(id)
db.delete(1)

// List all ids and their data
// db.list(path)
db.list('example.json')

// Clear the database
// db.clear(path)
db.truncate('./path/file.json')

// Check if the database exists
// db.exists(path)
db.exists('file.json')
```

## Installation

```bash
npm install @hillzacky/node-db
```


## Licence

This project is licensed under the GNU GPLv3 License - see the [LICENCE](LICENCE) file for details
