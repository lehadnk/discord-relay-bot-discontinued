var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db3');

db.run("CREATE TABLE participants (id INTEGER PRIMARY KEY AUTOINCREMENT, discord_id TEXT, discord_server_id TEXT, name TEXT, parsed_name TEXT)");
db.run("CREATE TABLE votes (id INTEGER PRIMARY KEY AUTOINCREMENT, discord_id TEXT, participant_id INTEGER)");
db.run("CREATE TABLE bans (id INTEGER PRIMARY KEY AUTOINCREMENT, discord_id TEXT, reason TEXT, issuer_discord_id TEXT, issuer_discord_name TEXT, issued_at TEXT)");