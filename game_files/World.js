const SQUARE_BY_LINE = 10;

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

class World {
    constructor (n) {
        this.canvas = document.getElementById("canvas");
        this.SHIFT = (innerHeight > innerWidth) ? 5 : 100;
        this.MAX_REF = (innerHeight > innerWidth) ? innerWidth - this.SHIFT : innerHeight - this.SHIFT;
        this.SQUARE_WIDTH = (this.MAX_REF - this.SHIFT) / SQUARE_BY_LINE;
        const ctx = canvas.getContext("2d");
        const rc = rough.canvas(document.getElementById('canvas'));
        this.ctx = ctx;
        this.rc = rc;
        let temp = [];
        for (let i = 0; i < n; i++) {
            temp.push([]);
            for (let j = 0; j < n; j++) {
                temp[i].push(0);
            }
        }
        this.arr = temp;
        this.draw();
    }
    draw() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.SHIFT = (innerHeight > innerWidth) ? 5 : 100;
            this.MAX_REF = (innerHeight > innerWidth) ? innerWidth - this.SHIFT : innerHeight - this.SHIFT;
            this.SQUARE_WIDTH = (this.MAX_REF - this.SHIFT) / SQUARE_BY_LINE;
            canvas.width = this.SQUARE_WIDTH * 10;
            canvas.height = canvas.width;
            canvas.style.left = (innerWidth / 2) - (canvas.width / 2) + "px";
            canvas.style.top = (innerHeight / 2) - (canvas.height / 2) + "px";
        
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < SQUARE_BY_LINE + 1; i++) {
                line(i * this.SQUARE_WIDTH, 0, i * this.SQUARE_WIDTH, 10 * this.SQUARE_WIDTH, this.ctx);
                line(0, i * this.SQUARE_WIDTH, 10 * this.SQUARE_WIDTH, i * this.SQUARE_WIDTH, this.ctx);
            }
        
            for (let j = 0; j < this.arr.length; j++) {
                for (let i = 0; i < this.arr[j].length; i++) {
                    if (this.arr[j][i]) {
                        let color = "blue";
                        let stackSize = this.arr[j][i];
                        if (stackSize < 0) {
                            color = "red";
                            stackSize *= -1;
                        }
                        this.rc.circle(i * this.SQUARE_WIDTH + this.SQUARE_WIDTH / 2, j * this.SQUARE_WIDTH + this.SQUARE_WIDTH / 2, this.SQUARE_WIDTH / 1.4, {
                            strokeWidth: 1,
                            stroke: color,
                            roughness: 0 + (stackSize / 10) * 3
                        });
                        let fontSize = this.SQUARE_WIDTH / 2;
                        this.ctx.font = fontSize + "px Courier New";
                        this.ctx.fillStyle = color;
                        this.ctx.fillText("" + stackSize, (i * this.SQUARE_WIDTH + this.SQUARE_WIDTH / 2) - (fontSize / 3),
                        (j * this.SQUARE_WIDTH + this.SQUARE_WIDTH / 2) + (fontSize / 3));
                    }
                }
            }
            this.ennemy = [];
        }, 50);
    }
}