const sqlite3 = require('sqlite3').verbose();
const Discord = require("discord.js");
const client = new Discord.Client();
const contest = require('./contest.js');

var db = new sqlite3.Database('database.db3');

var loadParticipantsList = function(db) {
    var participants = [];
    db.all("SELECT discord_id, discord_server_id FROM participants", (err, rows) => {
        rows.forEach((row) => {
            participants.push({discord_id: row.discord_id, server_id: row.discord_server_id});
        }); 
    });
    return participants;
}

var participants = loadParticipantsList(db);

client.login(process.env.BOT_TOKEN).then(() => {
    participants.forEach((participant) => {
        var guild = client.guilds.get(participant.server_id);
        var member = guild.members.get(participant.discord_id);
        
        if (typeof member == "undefined") return;
        
        member.user.sendMessage("Привет!\nЯ бот который управляет конкурсом трансмогов.\n\nК сожалению, некоторые участники конкурса попросили меня удалить их картинки, т.к. были залиты неверные изображения, а я в свою очередь удалил много всякого лишнего :( Поскольку это ставит участников конкурса в неравное положение, мой разработчик принял решение почистить канал, а мне завтра оторвут руки и я больше удалять ничего не смогу.\n\nС остальным мы сами разберемся, а ты, - перезалей, пожалуйста, свое изображение в #xmog-contest своего сверера еще раз.\n\nПрошу прощения за неполадки, твой бот, не спавший примерно 576 часов.");
    });
});
