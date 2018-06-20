const chatFunctions = require('./chat-functions.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.register = function(db, msg) {
    db.get(
        "SELECT count(id) as cnt FROM pidorgame WHERE discord_id = ?1",
        {
            1: msg.author.id
        },
        (err, row) => {
            if (row.cnt > 0) {
                chatFunctions.temporaryMessage(msg.channel, "Yes, "+chatFunctions.getNickname(msg)+", you're already participate in this game you silly.", 9000);
                return false;
            } else {
                db.run("INSERT INTO pidorgame(discord_id, name, score) VALUES (?1, ?2, ?3)", {
                    1: msg.author.id,
                    2: chatFunctions.getNickname(msg),
                    3: 0
                });
                chatFunctions.temporaryMessage(msg.channel, "Alright, you're in, **"+chatFunctions.getNickname(msg)+"**", 7000);
            }
        }
    );
};

exports.run = async function(db, msg) {
    msg.channel.send("Woob-woob, that's da sound of da pidor-police!");
    await sleep(2000);
    msg.channel.send("Выезжаю на место...");
    await sleep(3000);
    msg.channel.send("Но кто же он?");
    await sleep(7000);

    db.all(
        "SELECT id, discord_id, name FROM pidorgame",
        (err, rows) => {
            if (typeof rows === 'undefined') {
                chatFunctions.temporaryMessage(msg.channel, "Something is sick and wrong with me: " + err);
            }
            if (typeof rows === 'undefined') {
                chatFunctions.temporaryMessage(msg.channel, "You can't run the game with no participants!", 9000);
                return false;
            } else {
                let player = rows[Math.floor(Math.random() * rows.length)];
                msg.channel.send("А вот и пидор - <@" + player.discord_id + ">");

                db.run("UPDATE pidorgame SET score = score + 1 WHERE id = ?1", {
                    1: player.id,
                });
            }
        }
    );
}

exports.stat = function(db, msg) {
    var sql = "SELECT name, score FROM pidorgame ORDER BY score DESC LIMIT 10";

    var strings = [];
    db.all(sql, (err, rows) => {
        console.log(rows);
        strings.push("**Топ-10 пидоров за все время:**\n");
        rows.forEach((row) => {
            strings.push(row.name+" - "+row.score+"\n");
        });

        var i, j, temparray, chunk = 30;
        for (i = 0, j = strings.length; i<j; i+=chunk) {
            temparray = strings.slice(i, i+chunk);

            var string = "";
            temparray.forEach(function(elem) {
                string += elem;
            });
            chatFunctions.temporaryMessage(msg.channel, string, 25000);
        }
    });
}