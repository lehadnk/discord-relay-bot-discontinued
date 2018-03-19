"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();
const http = require('http');
http.createServer(function (req, res) {}).listen(process.env.PORT || 6000);

// Loading blacklist
var fs = require('fs');
var blacklist = fs.readFileSync('blacklist.txt').toString().split("\n");

var synchedChannels = [
    'cross-chat',
    'xmog-contest',
    'cross-addons-ui',
];

var stringToColour = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

var getInfo = function (name, channel) {
    client.users.forEach(function (user) {
        if (user.username == name) {
            channel.send(user.username+': '+user.id);
        }
    });
}

var ban = function (id, channel) {
    blacklist.push(id);
    fs.appendFile('blacklist.txt', id);
    channel.send(id+' was added to relay blacklist.');
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
    
    return msg.member.user.displayName;
}

var getColor = function(msg) {
    switch(msg.guild.id) {
        case '207912188407578624':
            return '#FFFFFF';
        case '215548192891076610':
            return '#A330C9';
        case '217529023838814208':
            return '#FFF569';
        case '217529109272592384':
            return '#C41F3B';
        case '203632333620772874':
            return '#FF7D0A';
        case '215427955193544704':
            return '#ABD473';
        case '210643527472906241':
            return '#F58CBA';
        case '214750173413376003':
            return '#0070DE';
    }
    
    return '#999999';
}

client.on('message', msg => {
    if (msg.content.match(/^\/info ((?! ).)*$/)) {
        var params = msg.content.split(' ');
        getInfo(params[1], msg.channel);
        return;
    }

    if (msg.content.match(/^\/ban ((?! ).)*$/)) {
        var params = msg.content.split(' ');
        ban(params[1], msg.channel);
        return;
    }
    
    if (synchedChannels.indexOf(msg.channel.name) == -1) return;
    if (blacklist.indexOf(msg.author.id) > -1) return;
    
    var embed = new Discord.RichEmbed()
        .setAuthor(getNickname(msg) + '  [' + msg.guild.name + ']', getAvatar(msg))
        .setDescription(msg.content)
        .setColor(getColor(msg));

    if (typeof msg.attachments.first() !== 'undefined') {
        embed.setImage(msg.attachments.first().url);
    }

    client.guilds.forEach(function (guild) {
        if (client.user.id !== msg.author.id && msg.author.bot == false && guild.id !== msg.guild.id) {
            guild.channels.find('name', msg.channel.name).sendEmbed(embed);
        }
    });
});


client.login(process.env.BOT_TOKEN);