"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();

var http = require('http');
http.createServer(function(req, res){}).listen(process.env.PORT || 6000);

client.on('message', msg => {
    var text = '**' + msg.member.displayName + '** [*' + msg.guild.name + '*]: \n' + msg.content;
    client.guilds.forEach(function (guild) {
        if (client.user.id !== msg.author.id && guild.id !== msg.guild.id && msg.channel.name == 'general') {
            if (guild.id == 297387654931152896) {
                guild.channels.find('name', 'general').sendMessage(text);
            }
        }
    });
});

client.login(process.env.BOT_TOKEN);
