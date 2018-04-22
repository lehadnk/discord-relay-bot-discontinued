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
                callback(rows);
            });
    }

    getParticipant(participantId, callback) {
        this.db.all("SELECT *\n" +
            "FROM votes\n" +
            "WHERE participant_id = ?1",
            {1: participantId},
            (err, rows) => {
                callback(rows);
            });
    }

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