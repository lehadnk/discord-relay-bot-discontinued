const chatFunctions = require('./chat-functions.js');

var parseName = function(charInfo) {
    var charName = charInfo.name.toLowerCase().replace(/ /g,'');
    if (charName.length > 12) {
        throw "Character name cannot be longer than 12 letters long";
    }
    if (charName.length < 2) {
        throw "Character name cannot be less than 2 letters long";
    }
    var charRealm = charInfo.realm.trim().toLowerCase().replace(/ /g,'');
    if (charRealm.length < 5) {
        throw "Realm name cannot be less than 5 letters long";
    }
    if (charRealm.length > 20) {
        throw "Realm name cannot be more than 20 letters long";
    }
    
    return charName+'-'+charRealm;
}
exports.parseName = parseName;

var nameStringToInfo = function(charInfoLine) {
    var charInfo = charInfoLine.split('-');
    if (charInfo.length < 2) {
        return null;
    }
    
    var charName = charInfo.splice(0, 1)[0].trim(' ');
    var charRealm = charInfo.join('-').trim(' ');
    return {name: charName, realm: charRealm};
}

var getCharInfoFromMsg = function(msgContent) {
    var msgParameters = msgContent.split('\n');
    if (msgParameters.length == 0) {
        return null;
    }
    
    var nameString = msgParameters[0];
    
    return nameStringToInfo(nameString);
}
exports.getCharInfoFromMsg = getCharInfoFromMsg;

var getCharInfoFromParam = function(msg) {
    var msgChunks = msg.content.split(' ');
    if (msgChunks.length < 2) {
        return null;
    }
    
    msgChunks.splice(0, 1);
    var nameString = msgChunks.join(' ');
    
    return nameStringToInfo(nameString);
}
exports.getCharInfo = getCharInfoFromParam;

var isXmogContestChannel = function(channel) {
    return channel.name == 'xmog-contest-test';
}
exports.isXmogContestChannel = isXmogContestChannel;

var saveParticipantMsgId = function(db, participantDiscordId, msg) {
    db.run("INSERT INTO participant_posts(participant_discord_id, discord_server_id, discord_message_id) VALUES (?1, ?2, ?3)", {
          1: participantDiscordId,
          2: msg.guild.id,
          3: msg.id
    });
}
exports.saveParticipantMsgId = saveParticipantMsgId;

exports.participantAdd = function(client, db, msg) {
    if (typeof msg.attachments.first() === 'undefined') {
        msg.delete(1000);
        return;
    }
    
    if (msg.content.length < 10) {
        msg.delete(1000);
        return;
    }

    var charInfo = getCharInfoFromMsg(msg.content);
    if (charInfo == null) {
        chatFunctions.temporaryMessage(msg.channel, "Please enter character name in corresponding format (Name - Realm)", 10000);
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
                chatFunctions.temporaryMessage(msg.channel, "Sorry, "+chatFunctions.getNickname(msg)+", you may participate with only one character.", 9000);
                msg.delete(1000);
                return false;
            } else {
                db.run("INSERT INTO participants(discord_id, discord_server_id, name, parsed_name) VALUES (?1, ?2, ?3, ?4)", {
                      1: msg.author.id,
                      2: msg.guild.id,
                      3: charInfo.name+" - "+charInfo.realm,
                      4: charName
                });
                chatFunctions.temporaryMessage(msg.channel, "New participant added: **"+charInfo.name+" - "+charInfo.realm+"**", 7000);
                chatFunctions.synchMessage(
                    client,
                    msg,
                    saveParticipantMsgId.bind(null, db, msg.author.id)
                );
                saveParticipantMsgId(db, msg.author.id, msg);
            }
        }
    );
}

exports.getParticipantsList = function(db, msg) {
    var sql = "SELECT p.name, count(v.id) as cnt FROM participants p LEFT JOIN votes v ON p.id = v.participant_id GROUP BY p.name ORDER BY cnt DESC";
        
    db.all(sql, (err, rows) => {
        var response = "**Participants list:**\n";
        rows.forEach((row) => {
            response += row.name+" - "+row.cnt+"\n";
        })
        chatFunctions.temporaryMessage(msg.channel, response, 25000);
    });
}

exports.doVote = function(db, msg) {
    var params = msg.content.split(' ');
    params.splice(0, 1);
    var unparsedName = params.join(' ');
    
    var charInfo = getCharInfoFromParam(msg);
    if (charInfo.length == null) {
        chatFunctions.temporaryMessage(msg.channel, "Please enter character name in corresponding format (Name - Realm)", 7000);
        msg.delete(1000);
        return;
    }
    
    var name = parseName(charInfo);
    
    db.get("SELECT id, discord_id FROM participants WHERE parsed_name = ?1", {1:name}, (err, row) => {
            if (typeof row === 'undefined') {
                chatFunctions.temporaryMessage(msg.channel, "No such participant found: "+unparsedName+". Are you sure that you're right with the spelling?", 10000);
                return;
            }
        
            var participant_id = row.id;
        
            if (row.discord_id == msg.author.id) {
                chatFunctions.temporaryMessage(msg.channel, "Voting for yourself to have some extra credit? How silly it is, "+chatFunctions.getNickname(msg), 10000);
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
                            chatFunctions.temporaryMessage(msg.channel, "Sorry, "+chatFunctions.getNickname(msg)+", you already voted for "+unparsedName+"!", 10000);
                        } else {
                            db.run("INSERT INTO votes(discord_id, participant_id) VALUES (?1, ?2)", {
                                  1: msg.author.id,
                                  2: participant_id
                            });
                            chatFunctions.temporaryMessage(msg.channel, "Alright, your vote counted, "+chatFunctions.getNickname(msg), 8000);
                        }
                }
            );
    });
    
    msg.delete(1000);
}

exports.removeParticipant = function(db, msg, client) {
    var params = msg.content.split(' ');
    
    if (params.length < 2) {
        throw "You're required to provide discord_id";
    }
    
    var discordId = params[1];
    
    db.all("SELECT * FROM participant_posts WHERE participant_discord_id = ?1", {1: discordId}, (err, rows) => {
        if (typeof rows === 'undefined') {
            chatFunctions.temporaryMessage(msg.channel, "No participant with discord_id found: "+discordId+". Are you sure that you're right with the spelling?", 10000);
            return;
        }
        
        rows.forEach(function(row) {
            var guild = client.guilds.get(row.discord_server_id);
            if (guild == null) {
                return;
            }
            
            var channel = guild.channels.find('name', 'xmog-contest');
            var message = channel.fetchMessages({around: row.discord_message_id, limit: 1}).then(messages => {
                messages.forEach(msg => {
                    msg.delete();
                });
            });
        });
    });
    
    db.run("DELETE FROM participants WHERE discord_id = ?1", {
        1: discordId
    });
    
    chatFunctions.temporaryMessage(msg.channel, "User "+discordId+" was removed from contest.", 12000);
}