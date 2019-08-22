const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rc = rough.canvas(document.getElementById('canvas'));
let lastInterval = -1;

canvas.style.position = "absolute";
canvas.style.zIndex = "1";
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.left = "0px";
canvas.style.top = "0px";

ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 10;

const spots = [
    {x: 0, y: 0},
    {x: 0, y: innerHeight},
    {x: innerWidth, y: 0},
    {x: innerWidth, y: innerHeight}
];

document.body.onclick = e => {
    let grow = 1;
    if (lastInterval !== -1) {
        clearInterval(lastInterval);
    }
    lastInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < spots.length; i++) {
            const obj = spots[i];
            const pos = {
                x: grow,
                y: (grow * (e.clientY - obj.y)) / (e.clientX - obj.x) 
            };
            ctx.beginPath();
            ctx.moveTo(obj.x, obj.y);
            if (e.clientX < obj.x) {
                ctx.lineTo(obj.x - pos.x, obj.y - pos.y);
            } else {
                ctx.lineTo(obj.x + pos.x, obj.y + pos.y);
            }
            ctx.stroke();
        }
        // rc.line(0, 0, pos.x, pos.y, {
        //     stroke: 'white',
        //     strokeWidth: 3
        // });
        grow += 10;
    }, 30);
}