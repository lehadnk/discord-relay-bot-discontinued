"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();
const http = require('http');
http.createServer(function (req, res) {}).listen(process.env.PORT || 6000);

// Loading blacklist
var fs = require('fs');
var blacklist = fs.readFileSync('blacklist.txt').toString().split("\n");

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
    
    if (msg.member === 'undefined' || msg.member === null) return;

    var embed = new Discord.RichEmbed()
        .setAuthor(msg.member.displayName + '  [' + msg.guild.name + ']', msg.member.user.displayAvatarURL)
        .setDescription(msg.content)
        .setColor(stringToColour(msg.member.displayName));
    
    if (typeof msg.attachments.first() !== 'undefined') {
        embed.setImage(msg.attachments.first().url);
    }

    client.guilds.forEach(function (guild) {
        if (client.user.id !== msg.author.id && msg.author.bot == false && guild.id !== msg.guild.id && (msg.channel.name == 'xmog-contest' || msg.channel.name == 'cross-chat') && (blacklist.indexOf(msg.author.id) == -1)) {
            guild.channels.find('name', msg.channel.name).sendEmbed(embed);
        }
    });
});


client.login(process.env.BOT_TOKEN);