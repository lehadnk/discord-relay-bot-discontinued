const chatFunctions = require('./chat-functions.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const prePhrases = [
    [
        'Woob-woob, that\'s da sound of da pidor-police!',
        'Выезжаю на место...',
        'Но кто же он?'
    ],
    [
        'Woob-woob, that\'s da sound of da pidor-police!',
        'Ведётся поиск в базе данных',
        'Ведётся захват подозреваемого...'
    ],
    [
        'Что тут у нас?',
        'А могли бы на работе делом заниматься...',
        'Проверяю данные...'
    ],
    [
        'Инициирую поиск пидора дня...',
        'Машины выехали',
        'Так-так, что же тут у нас...',
    ],
    [
        'Что тут у нас?',
        'Военный спутник запущен, коды доступа внутри...',
        'Не может быть!',
    ]
];

const resultPhrases = [
    'А вот и пидор - ',
    'Вот ты и пидор, ',
    'Ну ты и пидор, ',
    'Сегодня ты пидор, ',
    'Анализ завершен, сегодня ты пидор, ',
    'ВЖУХ И ТЫ ПИДОР, ',
    'Пидор дня обыкновенный, 1шт. - ',
    'Стоять! Не двигаться! Вы объявлены пидором дня, ',
    'И прекрасный человек дня сегодня... а нет, ошибка, всего-лишь пидор - ',
];

var getRandomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

exports.canStartGame = function(author) {
    return author.id === '207169330549358592';
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
    var phrases = getRandomElement(prePhrases);
    asyncForEach(phrases, async (phrase) => {
        msg.channel.send(phrase);
        await sleep(2500);
    });

    await sleep(5500);

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
                let player = getRandomElement(rows);
                let phrase = getRandomElement(resultPhrases);
                msg.channel.send(phrase + "<@" + player.discord_id + ">");

                db.run("UPDATE pidorgame SET score = score + 1 WHERE id = ?1", {
                    1: player.id,
                });
            }
        }
    );
}

exports.stat = function(db, msg) {
    var sql = "SELECT name, score FROM pidorgame WHERE score > 0 ORDER BY score DESC LIMIT 10";

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