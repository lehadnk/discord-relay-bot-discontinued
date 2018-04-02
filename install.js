var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db3');

db.run("CREATE TABLE participants (id INTEGER PRIMARY KEY AUTOINCREMENT, discord_id TEXT, name TEXT)");