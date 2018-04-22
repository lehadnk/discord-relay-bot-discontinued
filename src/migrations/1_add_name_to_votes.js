var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../../database.db3');

db.run("ALTER TABLE votes ADD COLUMN discord_server_id TEXT");
db.run("ALTER TABLE votes ADD COLUMN discord_name TEXT");