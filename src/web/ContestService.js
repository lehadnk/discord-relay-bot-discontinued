class ContestService {
    constructor(db) {
        this.db = db;
    }

    getParticipantsList(callback) {
        this.db.all("SELECT p.*, count(v.id) as votes\n" +
            "FROM participants p\n" +
            "LEFT JOIN votes v ON p.id = v.participant_id\n" +
            "GROUP BY p.id\n" +
            "ORDER BY votes DESC",
            (err, rows) => {
                let result = [];
                rows.forEach((r) => {
                    result.push({
                        id: r.id,
                        name: r.name,
                        image_url: r.image_url
                    });
                });

                function shuffle(a) {
                    var j, x, i;
                    for (i = a.length - 1; i > 0; i--) {
                        let d = new Date();
                        let j = Math.floor(d.getMinutes().toString()[1] / 2);
                        // console.log(j);
                        // //let

                        // j = Math.floor(Math.random() * (i + 1));
                        //console.log(j);
                        x = a[i];
                        a[i] = a[j];
                        a[j] = x;
                    }
                    return a;
                }

                let leaders = result.splice(0, 5);
                let leadersShuffled = shuffle(leaders);

                leadersShuffled.forEach((l) => {
                    result.unshift(l);
                });

                callback(result);
            });
    }

    // getParticipant(participantId, callback) {
    //     this.db.all("SELECT *\n" +
    //         "FROM votes\n" +
    //         "WHERE participant_id = ?1",
    //         {1: participantId},
    //         (err, rows) => {
    //             callback(rows);
    //         });
    // }

    getVotersList(callback) {
        this.db.all("SELECT discord_id, discord_name, count(id) as votes\n" +
            "FROM votes\n" +
            "GROUP BY discord_id\n" +
            "ORDER BY votes DESC",
            (err, rows) => {
                callback(rows);
            });
    }

    getVoter(voterId, callback) {
        this.db.all("SELECT p.*\n" +
            "FROM participants p\n" +
            "JOIN votes v ON p.id = v.participant_id\n" +
            "WHERE v.discord_id = ?1",
            {1: voterId},
            (err, rows) => {
                callback(rows);
            });
    }
};

module.exports = ContestService;