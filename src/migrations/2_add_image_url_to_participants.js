var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../../database.db3');

db.run("ALTER TABLE participants ADD COLUMN image_url TEXT");