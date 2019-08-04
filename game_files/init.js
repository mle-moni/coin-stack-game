const SQUARE_BY_LINE = 10;
const canvas = document.getElementById("canvas");

console.log(canvas)
const ctx = canvas.getContext("2d");
const rc = rough.canvas(document.getElementById('canvas'));

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
    const SHIFT = (innerHeight > innerWidth) ? 5 : 100;
    const MAX_REF = (innerHeight > innerWidth) ? innerWidth - SHIFT : innerHeight - SHIFT;
    const SQUARE_WIDTH = (MAX_REF - SHIFT) / SQUARE_BY_LINE;
    canvas.width = SQUARE_WIDTH * 10;
    canvas.height = canvas.width;
    canvas.style.left = (innerWidth / 2) - (canvas.width / 2) + "px";
    canvas.style.top = (innerHeight / 2) - (canvas.height / 2) + "px";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < SQUARE_BY_LINE + 1; i++) {
        line(i * SQUARE_WIDTH, 0, i * SQUARE_WIDTH, 10 * SQUARE_WIDTH, ctx);
        line(0, i * SQUARE_WIDTH, 10 * SQUARE_WIDTH, i * SQUARE_WIDTH, ctx);
    }
}, 50);

let update = setInterval(() => {
    
}, 10);