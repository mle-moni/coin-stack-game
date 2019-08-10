

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
    temp[0][0] = 1;
    temp[9][9] = -1;
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
    let bonus = 0;
    let stacksNumber = 0;
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            let tmp = map[j][i];
            if (isSameSign(tmp, sign)) {
                stacksNumber++;
                if (tmp < 0)
                    tmp *= -1;
                if (tmp < 9 && tmp > 5)
                    bonus += 1;
                if (tmp === 9)
                    bonus += 2;
            }
        }
    }
    bonus += Math.floor(stacksNumber / 10);
    return 3 + bonus;
}

function testPos(pos, pos2) {
    let diffX = pos.x - pos2.x;
    let diffY = pos.y - pos2.y;
    let testX = false;
    let testY = false;
    if (diffX === -1 || diffX === 1)
        testX = true;
    if (diffY === -1 || diffY === 1)
        testY = true;
    if (testX && testY) {
        return false;
    }
    return (testX || testY);
}

function fillFrom(pos, map, sign, bounds) {
    if (pos.x !== bounds.x && pos.y !== bounds.y) {
        map[pos.y][pos.x] = sign;
        fillFrom({x: pos.x + 1, y: pos.y}, map, sign, bounds);
        fillFrom({x: pos.x, y: pos.y + 1}, map, sign, bounds);
    }
}

function checkFrom(pos, map, sign, countWidth) {
    if (pos.x + countWidth > map.length - 1 || pos.y + countWidth > map.length - 1) {
        return ;
    }
    if (isSameSign(sign, map[pos.y][pos.x + countWidth]) && isSameSign(sign, map[pos.y + countWidth][pos.x])) {
        let ok = true;
        if (countWidth > 1) {
            for (let x = pos.x; x < pos.x + countWidth; x++) {
                if (!isSameSign(sign, map[pos.y + countWidth][x])) {
                    checkFrom(pos, map, sign, countWidth + 1);
                    ok = false;
                }
            }
            for (let y = pos.y; y < pos.y + countWidth; y++) {
                if (!isSameSign(sign, map[y][pos.x + countWidth])) {
                    checkFrom(pos, map, sign, countWidth + 1);
                    ok = false;
                }
            }
            if (ok)
                fillFrom({x: pos.x + 1, y: pos.y + 1}, map, sign, {x: pos.x + countWidth, y: pos.y + countWidth});
        }
        checkFrom(pos, map, sign, countWidth + 1);
    }
}

function checkPerfectSquares(map, sign) {
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (isSameSign(sign, map[j][i])) {
                let pos = {x: i, y: j};
                checkFrom(pos, map, sign, 1);
            }
        }
    }
}

function isFull(map) {
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            if (map[j][i] == 0) {
                return false;
            }
        }
    }
    return true;
}

function countPoints(map, sign) {
    let stacksNumber = 0;
    for (let j = 0; j < map.length; j++) {
        for (let i = 0; i < map[j].length; i++) {
            let tmp = map[j][i];
            if (isSameSign(tmp, sign)) {
                stacksNumber++;
            }
        }
    }
    return stacksNumber;
}

function turn(socket, io, mode, pos, pos2) {
    const qSyst = require("./queueSystem");
    let roomID = qSyst.roomsGet(socket.psd);
    if (roomID && socket.actionsCount) {
        const room = qSyst.rooms[roomID];
        let sign = (room.pseudoTurns%2 === 0) ? 1: -1;
        let ok = false;
        switch (mode) {
            case "split":
                if (pos && pos.hasOwnProperty("x") && pos.hasOwnProperty("y") && pos2 && pos2.hasOwnProperty("x") && pos2.hasOwnProperty("y")) {
                    if (isSameSign(sign, room.map[pos.y][pos.x])) {
                        const originStackSize = room.map[pos.y][pos.x];
                        const targetStackSize = room.map[pos2.y][pos2.x];
                        if (Math.abs(originStackSize) > 1 && testPos(pos, pos2)) {
                            // ligne a modifier si on peut voler le territoire de l'adversaire
                            room.map[pos.y][pos.x] = sign;
                            room.map[pos2.y][pos2.x] = originStackSize - sign + targetStackSize;
                            checkPerfectSquares(room.map, sign);
                            ok = true;
                        }
                    }
                }
            break;
            default: // add
                if (pos && pos.hasOwnProperty("x") && pos.hasOwnProperty("y")) {
                    if (isSameSign(sign, room.map[pos.y][pos.x]) &&  Math.abs(room.map[pos.y][pos.x]) !== 9) {
                        room.map[pos.y][pos.x] += sign;
                        ok = true;
                    }
                }
            break;
        }
        if (ok) {
            socket.actionsCount--;
            socket.emit("turn", socket.actionsCount);
            if (isFull(room.map)) {
                let blue = {points: countPoints(room.map, 1), msg: "Match null ", psd: room.p1};
                let red = {points: countPoints(room.map, -1), msg: "Match null ", psd: room.p2};
                if (blue.points > red.points) {
                    blue.msg = "Victoire ";
                    red.msg = "Défaite ";
                }
                if (red.points > blue.points) {
                    red.msg = "Victoire ";
                    blue.msg = "Défaite ";
                }
                io.in(room.broadcast).emit("update", room.map);
                setTimeout(() => {
                    room.sockets[0].emit("end_game", blue.msg + `contre ${room.p2}`);
                    room.sockets[1].emit("end_game", red.msg + `contre ${room.p1}`);
                    delete(qSyst.rooms[blue.psd]);
                    delete(qSyst.rooms[red.psd]);
                }, 200);
            } else {
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
    }
}