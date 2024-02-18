/* NodeDB
 * Node-db is Library for using local database with json for nodejs.
 * Github: https://github.com/hillzacky/node-db
 * Licence: GNU General Public License v3.0
 * By: Hilmansyah
 */

const fs = require("fs");
const path = require("path");
const colors = require("colors");

// Logging functions 
function log(message) {
    console.log(colors.blue("NodeDB: ") + colors.white(message));
}

function warn(message) {
    console.log(colors.yellow("NodeDB: ") + colors.white(message));
}

function error(message) {
    console.log(colors.red("NodeDB: ") + colors.white(message));
}

function errno(message) {
    console.log(colors.bgRed("NodeDB: ") + colors.white(message));
}

function success(message) {
    console.log(colors.green("NodeDB: ") + colors.white(message));
}

// NodeDB Class
class NodeDB {
    constructor(filename) {
        this.path = path.join(process.cwd(), filename);
    }

    /**
     * Creates a new database with a given name and description
     * @param {string} name name of the database
     * @param {string} description description of the database
     * @returns true if successful, false if not
     */
    create(name, description) {
        // Check that the database doesn't already exist.
        if (fs.existsSync(this.path)) {
            errno(`Database '${name}' already exists.`);
            return false;
        }

        // Create the database object.
        const db = {
            meta: {
                name,
                description,
            },
            data: {},
        };

        // Create the database.
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Database '${name}' created at ${this.path}`);
        } catch (err) {
            errno(`Failed to create database '${name}': ${err.message}`);
            return false;
        }
        return true;
    }

    /**
     * Add data to the database
     * @param {string} data data to append to the database
     * @param {integer} id id to append the data to (optional - if not passed then it will append to the next available id)
     * @returns id if successful, nothing if not
     */
    insert(data, id = NaN) {
        // Check that the database exists.
        if (!fs.existsSync(this.path)) {
            errno(`Database '${this.path}' does not exist.`);
            return;
        }

        // Read the database.
        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            errno(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }
        // Check that the ID doesn't already exist.
        let new_id;
        if (isNaN(id)) {
            let i = 0;
            // Find the next available ID.
            while (db.data[i]) {
                i++;
            }
            new_id = i;
        } else {
            new_id = id;
            // Check that the ID doesn't already exist.
            if (db.data[id]) {
                // The ID already exists. So we print a warning and use the next available ID.
                warn(`ID '${id}' already exists in database '${this.path}'. Will use next available ID.`);
                let i = 0;
                while (db.data[i]) {
                    i++;
                }
                new_id = i;
            }
        }

        db.data[new_id] = data;

        // Write the database.
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Appended data to database '${this.path}'`);
        } catch (err) {
            // If we failed to write the database, we return nothing and print an error.
            errno(`Failed to append data to database '${this.path}': ${err.message}`);
            return;
        }
        return id;
    }

    /**
     * Add data to the database with a given id
     * @param {integer} id id to write the data to
     * @param {string} data the data to write
     * @returns id if successful, nothing if not
     */
    update(id, data) {
        // Check that the database exists.
        if (!fs.existsSync(this.path)) {
            errno(`Database '${this.path}' does not exist.`);
            return;
        }

        // Read the database.
        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            errno(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        // Check that the ID exists.
        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${this.path}'.`);
            return;
        }

        db.data[id] = data;

        // Write the database.
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Wrote data to database '${this.path}'`);
        } catch (err) {
            errno(`Failed to write data to database '${this.path}': ${err.message}`);
            return;
        }

        return id;
    }

    /**
     * Read data from the database with a given id
     * @param {integer} id the id to read
     * @returns the data if successful, nothing if not
     */
    read(id) {
        // Check that the database exists.
        if (!fs.existsSync(this.path)) {
            errno(`Database '${this.path}' does not exist.`);
            return;
        }

        // Read the database.
        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            errno(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        // Check that the ID exists.
        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${this.path}'.`);
            return;
        }

        // Return the data.
        return db.data[id];
    }

    /**
     * Delete data from the database with a given id
     * @param {integer} id the id to delete 
     * @returns true if successful, false if not
     */
    delete(id) {
        if (!fs.existsSync(this.path)) {
            errno(`Database '${this.path}' does not exist.`);
            return false;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            errno(`Failed to read database '${this.path}': ${err.message}`);
            return false;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${this.path}'.`);
            return false;
        }

        delete db.data[id];
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Deleted data from database '${this.path}'`);
        } catch (err) {
            errno(`Failed to delete data from database '${this.path}': ${err.message}`);
            return false;
        }

        return true;
    }

    /**
     * List the database
     * @returns the entire database
     */
    list() {
        // Check that the database exists.
        if (!fs.existsSync(this.path)) {
            errno(`Database '${this.path}' does not exist.`);
            return;
        }

        // Read the database.
        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            errno(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        return db.data;
    }


    /**
     * Clears the database
     * @returns nothing
     */
    truncate() {
        // Check that the database exists.
        if (!fs.existsSync(this.path)) {
            errno(`Database '${this.path}' does not exist.`);
            return;
        }

        // Read the database.
        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            errno(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        // Clear the database.
        db.data = {};
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Cleared database '${this.path}'`);
        } catch (err) {
            errno(`Failed to clear database '${this.path}': ${err.message}`);
            return;
        }
    }

    /**
     * Check if the database exists
     * @returns returns true if the database exists, false if not
     */
    exists() {
        // Check that the database exists and return the result.
        return fs.existsSync(this.path);
    }
}

module.exports = NodeDB;
