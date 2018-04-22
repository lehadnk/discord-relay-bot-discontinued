const sqlite3 = require('sqlite3').verbose();
const Discord = require("discord.js");
const client = new Discord.Client();
const contest = require('../modules/contest.js');

var db = new sqlite3.Database('database.db3');

var linkMessage = function(msgId, serverId, parsedName) {
    db.get(
        "SELECT discord_id FROM participants WHERE parsed_name = ?1",
        {
            1: parsedName
        },
        (err, row) => {
            if (typeof row === 'undefined') {
                console.error("Unable to find participant: "+parsedName);
            } else {
                contest.saveParticipantMsgId(db, row.discord_id, {id: msgId, guild: {id: serverId}});
                console.log("Added msg "+msgId+" for "+row.discord_id);
            }
        }
    );
}

var parseMessage = function(msg) {
    var msgId = msg.id;
    var serverId = msg.channel.guild.id;
    var fromAnotherServer = msg.embeds.length > 0;
    var msgContent = fromAnotherServer ? msg.embeds[0].description : msg.content;
    
    if (typeof msgContent === 'undefined') return;
    
    msgContent = msgContent.replace("\r\n", "\n");
    
    var charInfo = contest.getCharInfoFromMsg(msgContent);

    if (charInfo == null) {
        return;
    }
    
    var parsedName = null;
    try {
        parsedName = contest.parseName(charInfo);
    } catch (err) {
        console.log(msgContent+" will NOT be deleted")
        return;
    }
    
    if (parsedName) {
        console.log(msgContent+" will be deleted");
        msg.delete();
    }
}

client.login(process.env.BOT_TOKEN).then(() => {
    client.guilds.forEach(function (guild) {
        console.log("Parsing "+guild.id);
        
        var channel = guild.channels.find('name', 'xmog-contest');
        if (channel == null) {
            return;
        }

        console.log("Fetching messages...");
        channel.fetchMessages({limit: 100}).then(messages => {
            messages.forEach(msg => {
                parseMessage(msg);
            });
        });
    });
});

