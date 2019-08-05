const gameCore = require("./gameCore");

const rooms = {};

module.exports = {
    add: add,
    rm: rm,
    roomsGet: roomsGet,
    rooms: rooms
};

const waiters = [];

function roomsGet(name) {
    for (let key in rooms) {
        if (key === name) {
            return key;
        }
    }
    return 0;
}

function matchPlayers(io) {
    const player1 = waiters.shift();
    const player2 = waiters.shift();
    player1.join(player1.psd + " " + player2.psd);
    player2.join(player1.psd + " " + player2.psd);
    const playersRooms = {
        sockets: [player1, player2],
        p1: player1.psd,
        p2: player2.psd,
        broadcast: player1.psd + " " + player2.psd,
        map: gameCore.init(),
        turns: 0,
        pseudoTurns: 0
    };
    rooms[player1.psd] = playersRooms;
    rooms[player2.psd] = playersRooms;
    io.in(playersRooms.broadcast).emit("match", player1.psd, player2.psd, playersRooms.map);
    let actionsCount = gameCore.getActions(playersRooms.map, 1);
    player1.actionsCount = actionsCount;
    io.in(player1.psd).emit("turn", actionsCount);
}

function add(socket, io) {
    if (socket.hasOwnProperty("psd")) {
        let tryReco = roomsGet(socket.psd);
        if (tryReco) {
            socket.join(rooms[tryReco].broadcast);
            socket.emit("reco", rooms[tryReco].p1, rooms[tryReco].p2, rooms[tryReco].map);
        } else {
            waiters.push(socket);
            if (waiters.length % 2 === 0) {
                matchPlayers(io);
            }
        }
    }
}

function rm(socket) {
    for (let i = 0; i < waiters.length; i++) {
        if (waiters[i].psd === socket.psd) {
            waiters.splice(i, 1);
        }
    }
}