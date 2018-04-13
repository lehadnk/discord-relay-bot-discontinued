const chatFunctions = require('./chat-functions.js');

exports.ban = function(db, msg, blacklist) {        
    var msgData = msg.content.split(' ');
    if (msgData.length < 3) {
        throw "To ban someone, you must enter discord id and reason";
    }
    
    var command = msgData.splice(0, 1).join();
    var discordId = msgData.splice(0, 1).join();
    var reason = msgData.join(' ');
    
    db.run("INSERT INTO bans(discord_id, reason, issuer_discord_id, issuer_discord_name, issued_at) VALUES (?1, ?2, ?3, ?4, ?5)", {
        1: discordId,
        2: reason,
        3: msg.author.id,
        4: chatFunctions.getNickname(msg),
        5: new Date().toISOString()
    });
    blacklist.push(discordId);
    
    var banMessageResponse = msg.channel.send("User "+discordId+" was banned in crosschat channels by "+chatFunctions.getNickname(msg)+". Reason: "+reason);
    banMessageResponse.then((m) => { synchMessage(m); });
}

exports.unban = function(db, msg, blacklist) {
    var msgData = msg.content.split(' ');
    
    if (msgData.length != 2) {
        throw "Wrong message format: should be /crossunban <id>";
    }
    
    var discordId = msgData[1];
    
    var index = blacklist.indexOf(discordId);
    if (index > -1) {
        blacklist.splice(index, 1);
        db.run("DELETE FROM bans WHERE discord_id = ?1", {1: discordId});

        var messageResponse = msg.channel.send("User's "+discordId+" ban was removed by "+chatFunctions.getNickname(msg));
        messageResponse.then((m) => { synchMessage(m); });
    } else {
        chatFunctions.temporaryMessage(msg.channel, discordId+" is not blacklisted.", 8000);
    }
}

exports.baninfo = function(db, msg) {
    var msgData = msg.content.split(' ');
    
    if (msgData.length != 2) {
        throw "Wrong message format: should be /crossunban <id>";
    }
    
    var discordId = msgData[1];
    db.all("SELECT * FROM bans WHERE discord_id = ?1", {1: discordId}, (err, rows) => {
        if (rows.length == 0) {
            msg.channel.send("User "+discordId+" is not banned.");
        } else {
            rows.forEach((row) => {
                msg.channel.send("User "+row.discord_id+" was banned by "+row.issuer_discord_name+" at "+row.issued_at+". Reason: "+row.reason);
            })
        }
    });
}

exports.banList = function(db, msg) {
    db.all("SELECT * FROM bans", (err, rows) => {
        var response = "**Crosschat ban list:**\n";
        rows.forEach((row) => {
            response += row.discord_id+" by "+row.issuer_discord_name+" at "+row.issued_at+" reason: "+row.reason+"\n";
        })
        chatFunctions.temporaryMessage(msg.channel, response, 25000);
    });
}

exports.loadBanList = function(db) {
    var blacklist = [];
    db.all("SELECT discord_id FROM bans", (err, rows) => {
        rows.forEach((row) => {
            blacklist.push(row.discord_id);
        }); 
    });
    return blacklist;
}