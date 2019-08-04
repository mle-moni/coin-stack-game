const SQUARE_BY_LINE = 10;
let SHIFT = (innerHeight > innerWidth) ? 5 : 100;
let MAX_REF = (innerHeight > innerWidth) ? innerWidth - SHIFT : innerHeight - SHIFT;
let SQUARE_WIDTH = (MAX_REF - SHIFT) / SQUARE_BY_LINE;
const canvas = document.getElementById("canvas");

console.log(canvas)
const ctx = canvas.getContext("2d");
const rc = rough.canvas(document.getElementById('canvas'));

class World {
    constructor (n) {
        let temp = [];
        for (let i = 0; i < n; i++) {
            temp.push([]);
            for (let j = 0; j < n; j++) {
                temp[i].push(0);
            }
        }
        this.arr = temp;
    }
}

const WORLD = new World(SQUARE_BY_LINE);

canvas.onclick = (e) => {
    const click = {
        x: Math.floor(e.layerX / SQUARE_WIDTH),
        y: Math.floor(e.layerY / SQUARE_WIDTH)
    };
    WORLD.arr[click.y][click.x]++;
}


const touches = {
    up: false,
    down: false,
    left: false,
    right: false
};

function line(x1, y1, x2, y2, ctx) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.moveTo(0, 0);
}

let draw = setInterval(() => {
    SHIFT = (innerHeight > innerWidth) ? 5 : 100;
    MAX_REF = (innerHeight > innerWidth) ? innerWidth - SHIFT : innerHeight - SHIFT;
    SQUARE_WIDTH = (MAX_REF - SHIFT) / SQUARE_BY_LINE;
    canvas.width = SQUARE_WIDTH * 10;
    canvas.height = canvas.width;
    canvas.style.left = (innerWidth / 2) - (canvas.width / 2) + "px";
    canvas.style.top = (innerHeight / 2) - (canvas.height / 2) + "px";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < SQUARE_BY_LINE + 1; i++) {
        line(i * SQUARE_WIDTH, 0, i * SQUARE_WIDTH, 10 * SQUARE_WIDTH, ctx);
        line(0, i * SQUARE_WIDTH, 10 * SQUARE_WIDTH, i * SQUARE_WIDTH, ctx);
    }

    for (let j = 0; j < WORLD.arr.length; j++) {
        for (let i = 0; i < WORLD.arr[j].length; i++) {
            if (WORLD.arr[j][i]) {
                rc.circle(i * SQUARE_WIDTH + SQUARE_WIDTH / 2, j * SQUARE_WIDTH + SQUARE_WIDTH / 2, SQUARE_WIDTH / 2, {
                    strokeWidth: 1,
                    stroke: "red",
                    roughness: 0 + (WORLD.arr[j][i] / 10) * 3
                });
            }
        }
    }
}, 50);

// let update = setInterval(() => {
    
// }, 10);