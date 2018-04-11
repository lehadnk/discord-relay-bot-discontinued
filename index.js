"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();
const http = require('http');
const sqlite3 = require('sqlite3').verbose();

http.createServer(function (req, res) {}).listen(process.env.PORT || 6000);
var db = new sqlite3.Database('database.db3');

// Loading blacklist
var blacklist = [];
db.all("SELECT discord_id FROM bans", (err, rows) => {
    rows.forEach((row) => {
        blacklist.push(row.discord_id);
    }); 
});

// Loading admin list
var fs = require('fs');
var adminList = fs.readFileSync('admins.txt').toString().split("\n");

var synchedChannels = [
    'cross-chat',
    'xmog-contest',
    'cross-addons-ui',
];

var getAvatar = function(msg) {
    if (msg.member !== 'undefined' && msg.guild !== 'undefined' && msg.member.id == '207169330549358592' && msg.guild.id == '203632333620772874') {
        return 'https://i.imgur.com/UBFnkWL.png';
    }
    
    if (msg.author !== 'undefined' && msg.author.displayAvatarUrl !== 'undefined') {
        return msg.author.displayAvatarURL;
    }
    
    if (msg.member !== 'undefined' && msg.member.user.displayAvatarUrl !== 'undefined') {
        msg.member.user.displayAvatarURL;
    }
    
    return null;
}

var getNickname = function(msg) {
    if (msg.member === 'undefined' || msg.member === null) {
        return msg.author.username;
    }
    
    return msg.member.displayName;
}

var getColor = function(msg) {
    switch(msg.guild.id) {
        case '207912188407578624': // priest
            return '#FFFFFF';
        case '215548192891076610': // dh
            return '#A330C9';
        case '217529023838814208': // rogue
            return '#FFF569';
        case '217529109272592384': // dk
            return '#C41F3B';
        case '203632333620772874': // druid
            return '#FF7D0A';
        case '215427955193544704': // hunter
            return '#ABD473';
        case '210643527472906241': // paladin
            return '#F58CBA';
        case '214750173413376003': // shaman
            return '#0070DE';
        case '212664465181769728': // mage
            return '#69CCF0';
        case '217529170291458048': // warlock
            return '#9482C9';
        case '217528830418616322': // warrior
            return '#C79C6E';
        case '217529277489479681': // monk
            return '#00FF96';
    }
    
    return '#999999'; // undefined
}

var doVote = function(msg) {
    var params = msg.content.split(' ');
    params.splice(0, 1);
    var unparsedName = params.join(' ');
    
    var charInfo = unparsedName.split('-');
    if (charInfo.length != 2) {
        temporaryMessage(msg.channel, "Please enter character name in corresponding format (Name - Realm)", 7000);
        msg.delete(1000);
        return;
    }
    
    var name = parseName(charInfo);
    
    db.get("SELECT id, discord_id FROM participants WHERE parsed_name = ?1", {1:name}, (err, row) => {
            if (typeof row === 'undefined') {
                temporaryMessage(msg.channel, "No such participant found: "+unparsedName+". Are you sure that you're right with the spelling?", 10000);
                return;
            }
        
            var participant_id = row.id;
        
            if (row.discord_id == msg.author.id) {
                temporaryMessage(msg.channel, "Voting for yourself to have some extra credit? How silly it is, "+getNickname(msg), 10000);
                return;
            }
            
            db.get(
                "SELECT count(id) as cnt FROM votes WHERE participant_id = ?1 AND discord_id = ?2",
                {
                    1: participant_id,
                    2: msg.author.id
                },
                (err, row) => {
                        if (row.cnt > 0) {
                            temporaryMessage(msg.channel, "Sorry, "+getNickname(msg)+", you already voted for "+unparsedName+"!", 10000);
                        } else {
                            db.run("INSERT INTO votes(discord_id, participant_id) VALUES (?1, ?2)", {
                                  1: msg.author.id,
                                  2: participant_id
                            });
                            temporaryMessage(msg.channel, "Alright, your vote counted, "+getNickname(msg));
                        }
                }
            );
    });
    
    msg.delete(1000);
}

var synchMessage = function(msg) {
    var embed = new Discord.RichEmbed()
        .setAuthor(getNickname(msg), getAvatar(msg))
        .setDescription(msg.content)
        .setColor(getColor(msg));

    if (typeof msg.attachments.first() !== 'undefined') {
        embed.setImage(msg.attachments.first().url);
    }
    
    client.guilds.forEach(function (guild) {
        if (guild.id !== msg.guild.id) {
            var channel = guild.channels.find('name', msg.channel.name);
            if (channel !== null) {
                channel.sendEmbed(embed);
            }
        }
    });
}

var parseName = function(charInfo) {
    var charName = charInfo[0].trim().toLowerCase().replace(/ /g,'');
    if (charName.length > 12) {
        throw "Character name cannot be longer than 12 letters long";
    }
    if (charName.length < 2) {
        throw "Character name cannot be less than 2 letters long";
    }
    var charRealm = charInfo[1].trim().toLowerCase().replace(/ /g,'');
    if (charRealm.length < 5) {
        throw "Realm name cannot be less than 5 letters long";
    }
    if (charRealm.length > 20) {
        throw "Realm name cannot be more than 20 letters long";
    }
    
    return charName+'-'+charRealm;
}

var participantAdd = function(msg) {
    if (typeof msg.attachments.first() === 'undefined') {
        msg.delete(1000);
        return;
    }
    if (msg.content.length < 10) {
        msg.delete(1000);
        return;
    }
    
    var charInfo = msg.content.split('-');
    if (charInfo.length != 2) {
        temporaryMessage(msg.channel, "Please enter character name in corresponding format (Name - Realm)", 10000);
        msg.delete(1000);
        return;
    }
    
    var charName = parseName(charInfo);
    
    db.get(
        "SELECT count(id) as cnt FROM participants WHERE discord_id = ?1",
        {
            1: msg.author.id
        },
        (err, row) => {
            if (row.cnt > 0) {
                temporaryMessage(msg.channel, "Sorry, "+getNickname(msg)+", you can participate with only one character.", 9000);
                msg.delete(1000);
                return false;
            } else {
                db.run("INSERT INTO participants(discord_id, name, parsed_name) VALUES (?1, ?2, ?3)", {
                      1: msg.author.id,
                      2: msg.content,
                      3: charName
                });
                temporaryMessage(msg.channel, "New participant added: **"+msg.content+"**", 7000);
                synchMessage(msg);
            }
        }
    );
}

var ban = function(msg) {
    if (adminList.indexOf(msg.author.id) == -1) {
        msg.channel.send("You're not permitted to do this, bitch");
        return;
    }
        
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
        4: getNickname(msg),
        5: new Date().toISOString()
    });
    blacklist.push(discordId);
    
    var banMessageResponse = msg.channel.send("User "+discordId+" was banned in crosschat channels by "+getNickname(msg)+". Reason: "+reason);
    banMessageResponse.then((m) => { synchMessage(m); });
}

var unban = function(msg) {
    if (adminList.indexOf(msg.author.id) == -1) {
        msg.channel.send("You're not permitted to do this, bitch");
        return;
    }
    
    var msgData = msg.content.split(' ');
    
    if (msgData.length != 2) {
        throw "Wrong message format: should be /crossunban <id>";
    }
    
    var discordId = msgData[1];
    
    var index = blacklist.indexOf(discordId);
    if (index > -1) {
        blacklist.splice(index, 1);
        db.run("DELETE FROM bans WHERE discord_id = ?1", {1: discordId});

        var messageResponse = msg.channel.send("User's "+discordId+" ban was removed by "+getNickname(msg));
        messageResponse.then((m) => { synchMessage(m); });
    } else {
        temporaryMessage(msg.channel, discordId+" is not blacklisted.", 8000);
    }
}

var baninfo = function(msg) {
    if (adminList.indexOf(msg.author.id) == -1) {
        msg.channel.send("You're not permitted to do this, bitch");
        return;
    }
    
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

var temporaryMessage = function(channel, text, lifespan) {
    var response = channel.send(text);
    response.then((m) => { m.delete(lifespan); });
};

client.on('message', msg => {    
    if (client.user.id === msg.author.id) return;
    if (msg.author.bot == true) return;
    
    if (msg.content.match(/^\/crossban .*$/)) {
        try {
            ban(msg);
        } catch(err) {
            temporaryMessage(msg.channel, err, 8000);
        }
        return;
    }
    
    if (msg.content.match(/^\/crossunban .*$/)) {
        try {
            unban(msg);
        } catch(err) {
            temporaryMessage(msg.channel, err, 8000);
        }
        return;
    }
    
    if (msg.content.match(/^\/crossbaninfo .*$/)) {
        try {
            baninfo(msg);
        } catch(err) {
            temporaryMessage(msg.channel, err, 8000);
        }
        return;
    }
    
    if (msg.content.match(/^\/crossbanlist$/)) {
        var sql = "SELECT * FROM bans";
        
        db.all(sql, (err, rows) => {
            var response = "**Crosschat ban list:**\n";
            rows.forEach((row) => {
                response += row.discord_id+" by "+row.issuer_discord_name+" at "+row.issued_at+" reason: "+row.reason+"\n";
            })
            temporaryMessage(msg.channel, response, 25000);
        });
    }
        
    if (blacklist.indexOf(msg.author.id) > -1) return;
    
    if (msg.content.match(/^\/xmog-participants-list/)) {
        var sql = "SELECT p.name, count(v.id) as cnt FROM participants p LEFT JOIN votes v ON p.id = v.participant_id GROUP BY p.name ORDER BY cnt DESC";
        
        db.all(sql, (err, rows) => {
            var response = "**Participants list:**\n";
            rows.forEach((row) => {
                response += row.name+" - "+row.cnt+"\n";
            })
            temporaryMessage(msg.channel, response, 25000);
        });
    }
    
    if (msg.content.match(/^\/vote .*$/) && msg.channel.name == 'xmog-contest') {        
        try {
            doVote(msg);
        } catch(err) {
            temporaryMessage(msg.channel, err, 8000);
        }
        
        return;
    }
    
    if (msg.channel.name == 'xmog-contest') {
        if (msg.author.id != 207169330549358592) {
            msg.delete();
            return;
        }
//        
//        try {
//            participantAdd(msg);
//        } catch(err) {
//            temporaryMessage(msg.channel, err, 8000);
//        }
//        return;
    }
    
    if (synchedChannels.indexOf(msg.channel.name) == -1) return;

    synchMessage(msg);
});


client.login(process.env.BOT_TOKEN);