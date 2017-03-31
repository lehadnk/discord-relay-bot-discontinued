"use strict";
const Discord = require("discord.js");
const client = new Discord.Client();

var http = require('http');
http.createServer(function (req, res) {}).listen(process.env.PORT || 6000);

client.on('message', msg => {
    var text = '**' + msg.member.displayName + '** [*' + msg.guild.name + '*]: \n' + msg.content;
    var embed = {};
    if (typeof msg.attachments.first() !== 'undefined') {
        embed = {
            'image': {
                'url': msg.attachments.first().url
            }
        };
    }
   
    client.guilds.forEach(function (guild) {
        if (client.user.id !== msg.author.id && guild.id !== msg.guild.id && msg.channel.name == 'general') {
            if (guild.id == 297387654931152896) {
                guild.channels.find('name', 'general').sendMessage(text, {
                    'embed': embed
                });
            }
        }
    });
});

client.login(process.env.BOT_TOKEN || 'Mjk3MzkyNTUyODA0MzUyMDAx.C8AH7g.MwcZ4xpQsejOYQn4nKE0QlfTzpc');
