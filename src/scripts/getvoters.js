const sqlite3 = require('sqlite3').verbose();
const Discord = require("discord.js");
const client = new Discord.Client();
const chatFunctions = require('../modules/chat-functions');

var db = new sqlite3.Database('../../database.db3');

var loadVotersList = function(db) {
    var voters = [];
    db.all("SELECT id, discord_id FROM votes", (err, rows) => {
        rows.forEach((row) => {
            participants.push({id: row.id, discord_id: row.discord_id});
        });
    });
    return voters;
}

let participants = loadVotersList(db);

function getMemberInfo(discord_id) {
    console.log("Looking for "+discord_id+"...");
    let member = null;
    client.guilds.forEach((guild) => {
        console.log("Searching in "+guild.name);
        if (member !== null) {
            return;
        }

        let gMember = guild.members.get(discord_id);
        if (typeof gMember !== 'undefined') {
            member = gMember;
        }
    });

    return member;
}

function getNickname(member) {
    return member.displayName;
}

client.login(process.env.BOT_TOKEN).then(() => {
    participants.forEach((participant) => {
        let member = getMemberInfo(participant.discord_id);

        let name = member != null ? getNickname(member) : participant.discord_id;
        console.log("Name = "+name);
        db.run('UPDATE votes SET discord_name = ?1 WHERE id = ?2', {
            1: name,
            2: participant.id
        });
    });
});
