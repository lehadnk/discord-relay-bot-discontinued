"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();
const http = require('http');
http.createServer(function (req, res) {}).listen(process.env.PORT || 6000);

// Loading blacklist
var fs = require('fs');
var blacklist = fs.readFileSync('blacklist.txt').toString().split("\n");
var adminList = fs.readFileSync('admins.txt').toString().split("\n");

var synchedChannels = [
    'cross-chat',
    'xmog-contest',
    'cross-addons-ui',
];

var ban = function (id, channel) {
    blacklist.push(id);
    fs.appendFile('blacklist.txt', id+"\n");
    channel.send(id+' was added to relay blacklist.');
}

var unban = function (id, channel) {
    var index = blacklist.indexOf(id);
    if (id > -1) {
        blacklist.splice(index, 1);
        fs.truncateSync('blacklist.txt', 0);
        blacklist.forEach(function(b) { fs.appendFile('blacklist.txt', b+"\n"); });
        channel.send(id+' was removed from relay blacklist.');
    } else {
        channel.send(id+' is not blacklisted.');
    }
}

var getAvatar = function(msg) {
    if (msg.member === 'undefined' || msg.member === null) {
        return msg.author.displayAvatarUrl;
    }
    
    return msg.member.user.displayAvatarURL;
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

client.on('message', msg => {    
    if (msg.content.match(/^\/crossban ((?! ).)*$/)) {
        if (adminList.indexOf(msg.author.id) == -1) {
            msg.channel.send("You're not permitted to do this, bitch");
            return;
        }
        var params = msg.content.split(' ');
        ban(params[1], msg.channel);
        return;
    }
    
    if (msg.content.match(/^\/crossunban ((?! ).)*$/)) {
        if (adminList.indexOf(msg.author.id) == -1) {
            msg.channel.send("You're not permitted to do this, bitch");
            return;
        }
        var params = msg.content.split(' ');
        unban(params[1], msg.channel);
        return;
    }
    
    if (synchedChannels.indexOf(msg.channel.name) == -1) return;
    if (blacklist.indexOf(msg.author.id) > -1) return;
    
    var embed = new Discord.RichEmbed()
        .setAuthor(getNickname(msg), getAvatar(msg))
        .setDescription(msg.content)
        .setColor(getColor(msg));

    if (typeof msg.attachments.first() !== 'undefined') {
        embed.setImage(msg.attachments.first().url);
    }

    client.guilds.forEach(function (guild) {
        if (client.user.id !== msg.author.id && msg.author.bot == false && guild.id !== msg.guild.id) {
            var channel = guild.channels.find('name', msg.channel.name);
            if (channel !== null) {
                //channel.sendEmbed(embed);
            }
        }
    });
});


client.login(process.env.BOT_TOKEN);