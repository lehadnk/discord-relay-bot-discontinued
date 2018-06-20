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
        "SELECT id, name FROM pidorgame ORDER ",
        {
            1: msg.author.id
        },
        (err, rows) => {
            if (rows.length === 0) {
                chatFunctions.temporaryMessage(msg.channel, "You can't run the game with no participants!", 9000);
                return false;
            } else {
                let player = rows[Math.floor(Math.random() * rows.length)];
                db.run("UPDATE pidorgame SET score = score + 1 WHERE id = ?1", {
                    1: player.id,
                });
                msg.channel.send("А вот и пидор - **" + player.name + "**");
            }
        }
    );



}