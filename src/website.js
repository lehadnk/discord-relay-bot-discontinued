const http = require('http');
const sqlite3 = require('sqlite3').verbose();
var ContestService = require('./web/ContestService');

var db = new sqlite3.Database('../database.db3');

function notFoundError(res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end();
}

function badRequestError(res) {
    res.writeHead(400, {'Content-Type': 'text/html'});
    res.end();
}

function jsonSuccessResponse(res, data) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.writeHead(200, {'Content-Type': 'application/json'});

    let responseData = {
        error: false,
        errorMessage: null,
        data: data
    };
    res.write(JSON.stringify(responseData));
    res.end();
}

function jsonErrorResponse(res, code, error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.writeHead(code, {'Content-Type': 'application/json'});

    let responseData = {
        error: true,
        errorMessage: error,
    };
    res.write(responseData.stringify());
    res.end();
}

http.createServer(function (req, res) {
    let urlChunks = req.url.split('/');
    if (urlChunks.length < 2) {
        return notFoundError(res);
    }

    let service = new ContestService(db);
    switch(urlChunks[1]) {
        case 'participants':
            return service.getParticipantsList((result) => {
                jsonSuccessResponse(res, result);
            });
        case 'participant':
            if (urlChunks.length < 3) {
                return badRequestError();
            }

            let participantId = urlChunks[2];

            return service.getParticipant(participantId, (result) => {
                jsonSuccessResponse(res, result);
            });
        case 'voters':
            return service.getVotersList((result) => {
                jsonSuccessResponse(res, result);
            });
        case 'voter':
            if (urlChunks.length < 3) {
                return badRequestError();
            }

            let voterId = urlChunks[2];

            return service.getVoter(voterId, (result) => {
                jsonSuccessResponse(res, result);
            });
    }

    notFoundError(res);
}).listen(process.env.PORT || 9000);