const Discord = require("discord.js");

var getClassColor = function(msg) {
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

var getAvatar = function(msg) {
    if (msg.author.id == '207169330549358592' && msg.guild.id == '203632333620772874') {
        return 'https://i.imgur.com/UBFnkWL.png';
    }
    
    return msg.author.displayAvatarURL;
}
exports.getAvatar = getAvatar;

var getNickname = function(msg) {
    if (msg.member === 'undefined' || msg.member === null) {
        return msg.author.username;
    }
    
    return msg.member.displayName;
}
exports.getNickname = getNickname;

exports.temporaryMessage = function(channel, text, lifespan) {
    var response = channel.send(text);
    response.then((m) => { m.delete(lifespan); });
};

exports.synchMessage = function(client, msg) {
    var embed = new Discord.RichEmbed()
        .setAuthor(getNickname(msg), getAvatar(msg))
        .setDescription(msg.content)
        .setColor(getClassColor(msg));

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