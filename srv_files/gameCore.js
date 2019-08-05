

module.exports = {
    init: init,
    getActions: getActions,
    turn: turn
};

function init() {
    let temp = [];
    for (let i = 0; i < 10; i++) {
        temp.push([]);
        for (let j = 0; j < 10; j++) {
            temp[i].push(0);
        }
    }
    temp[0][0] = 4;
    temp[9][9] = -4;
    return temp;
}

function isSameSign(a, b) {
    if (a < 0 && b < 0)
        return true;
    if (a > 0 && b > 0)
        return true;
    return false;
}

function getActions(map, sign) {
    const qSyst = require("./queueSystem");
    let best = 0;
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            let tmp = map[j][i];
            if (isSameSign(tmp, sign)) {
                if (tmp < 0)
                    tmp *= -1;
                if (best < tmp)
                    best = tmp;
            }
        }
    }
    let bonus = (best > 5) ? best - 5 : 0;
    return 3 + bonus;
}

function turn(socket, io, mode, pos) {
    const qSyst = require("./queueSystem");
    let roomID = qSyst.roomsGet(socket.psd);
    if (roomID && socket.actionsCount) {
        const room = qSyst.rooms[roomID];
        let sign = (room.pseudoTurns%2 === 0) ? 1: -1;
        switch (mode) {
            case "split":
                
            break;
            default: // add
                room.map[pos.y][pos.x] += sign;
            break;
        }
        socket.actionsCount--;
        if (socket.actionsCount === 0) {
            room.pseudoTurns++;
            room.pseudoTurns %= 2;
            let sign = room.pseudoTurns === 0 ? 1 : -1;
            room.sockets[room.pseudoTurns].actionsCount = getActions(room.map, sign);
            room.sockets[room.pseudoTurns].emit("turn", room.sockets[room.pseudoTurns].actionsCount);
            if (room.pseudoTurns === 0) {
                room.turns++;
            }
        }
        io.in(room.broadcast).emit("update", room.map);
    }
}